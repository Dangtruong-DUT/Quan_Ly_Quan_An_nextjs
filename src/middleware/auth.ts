import { NextRequest, NextResponse } from "next/server";

export function getTokens(request: NextRequest) {
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    return { accessToken, refreshToken };
}

export function handleInvalidAccessToken(
    accessToken: string | undefined,
    refreshToken: string | undefined,
    pathname: string,
    request: NextRequest,
    locale: string
) {
    const isAccessTokenValid = accessToken !== undefined;
    const isAuthenticated = refreshToken !== undefined;

    if (!isAccessTokenValid && isAuthenticated) {
        const url = new URL(`/${locale}/refresh-token`, request.url);
        url.searchParams.set("redirect", pathname);
        url.searchParams.set("refreshToken", refreshToken!);
        return NextResponse.redirect(url);
    }

    return null;
}
