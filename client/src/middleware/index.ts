import { NextRequest, NextResponse } from "next/server";
import { getTokens, handleInvalidAccessToken } from "./auth";
import { privatePath, unAuthPath, isPathMatch } from "./pathCheck";
import { handleRoleAccess } from "./roleCheck";

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const { accessToken, refreshToken } = getTokens(request);
    const isAccessTokenValid = !!accessToken;
    const isAuthenticated = !!refreshToken;

    const isPrivatePath = isPathMatch(privatePath, pathname);
    const isUnAuthPath = isPathMatch(unAuthPath, pathname);

    // Handle refresh token
    const refreshRedirect = handleInvalidAccessToken(accessToken, refreshToken, pathname, request);
    if (refreshRedirect) return refreshRedirect;

    // Not authenticated trying to access private
    if (isPrivatePath && !isAuthenticated) {
        const url = new URL("/login", request.url);
        url.searchParams.set("clearToken", "true");
        return NextResponse.redirect(url);
    }

    // Authenticated trying to access login/register
    if (isUnAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // Authenticated + access token valid => Check role access
    if (isAccessTokenValid && isAuthenticated) {
        const roleRedirect = handleRoleAccess(accessToken!, pathname, request);
        if (roleRedirect) return roleRedirect;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/manage/:path*", "/login", "/register", "/guest/:path*"],
};
