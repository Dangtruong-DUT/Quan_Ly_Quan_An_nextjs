import { HEADER_NAME, locales } from "@/i18n/config";
import { getTokens, handleInvalidAccessToken } from "@/middleware/auth";
import { isPathMatch, privatePath, unAuthPath } from "@/middleware/pathCheck";
import { handleRoleAccess } from "@/middleware/roleCheck";
import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

export function middleware(request: NextRequest) {
    const defaultLocale = (request.headers.get(HEADER_NAME) || "en") as (typeof locales)[number];
    const handleI18nRouting = createMiddleware({
        locales,
        defaultLocale,
    });
    const response = handleI18nRouting(request);
    response.headers.set(HEADER_NAME, defaultLocale);

    const { pathname } = request.nextUrl;

    const { accessToken, refreshToken } = getTokens(request);
    const isAccessTokenValid = !!accessToken;
    const isAuthenticated = !!refreshToken;

    const isPrivatePath = isPathMatch(privatePath, pathname);
    const isUnAuthPath = isPathMatch(unAuthPath, pathname);

    // Handle refresh token
    const refreshRedirect = handleInvalidAccessToken(accessToken, refreshToken, pathname, request, defaultLocale);
    if (refreshRedirect) return refreshRedirect;

    // Not authenticated trying to access private
    if (isPrivatePath && !isAuthenticated) {
        const url = new URL(`/${defaultLocale}/login`, request.url);
        url.searchParams.set("clearToken", "true");
        return NextResponse.redirect(url);
    }

    // Authenticated trying to access login/register
    if (isUnAuthPath && isAuthenticated) {
        const url = new URL("/", request.url);
        return NextResponse.redirect(url);
    }

    // Authenticated + access token valid => Check role access
    if (isAccessTokenValid && isAuthenticated) {
        const NextResponse = handleRoleAccess(accessToken!, pathname, request);
        if (NextResponse) {
            return NextResponse;
        }
    }

    return response;
}

export const config = {
    matcher: ["/", "/(vi|en)/:path*"],
};
