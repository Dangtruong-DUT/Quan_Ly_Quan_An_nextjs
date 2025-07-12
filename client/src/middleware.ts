import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePath = ["/manage"];
const unAuthPath = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const isAccessTokenValid = Boolean(accessToken);
    const isAuthenticated = Boolean(refreshToken);
    const isPrivatePath = privatePath.some((path) => pathname.startsWith(path));
    const isUnAuthPath = unAuthPath.some((path) => pathname.startsWith(path));
    if (!isAccessTokenValid && isAuthenticated) {
        const url = new URL("/refresh-token", request.url);
        url.searchParams.set("redirect", pathname);
        url.searchParams.set("refreshToken", refreshToken!);
        return NextResponse.redirect(url);
    }
    if (isPrivatePath && !isAuthenticated) {
        const url = new URL("/login", request.url);
        url.searchParams.set("clearToken", "true");
        return NextResponse.redirect(url);
    }
    if (isUnAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/manage/:path*", "/login", "/register"],
};
