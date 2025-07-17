import { Role } from "@/constants/type";
import { TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const manaPath = ["/manage"];
const guestPath = ["/guest"];
const onlyOwnerPath = ["/manage/accounts"];
const privatePath = [...manaPath, ...guestPath];
const unAuthPath = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;
    const isAccessTokenValid = accessToken !== undefined;
    const isAuthenticated = refreshToken !== undefined;
    const isPrivatePath = privatePath.some((path) => pathname.startsWith(path));
    const isUnAuthPath = unAuthPath.some((path) => pathname.includes(path));

    // if the access token is invalid and the user is authenticated, redirect to refresh token endpoint
    if (!isAccessTokenValid && isAuthenticated) {
        const url = new URL("/refresh-token", request.url);
        url.searchParams.set("redirect", pathname);
        url.searchParams.set("refreshToken", refreshToken!);
        return NextResponse.redirect(url);
    }

    // if the user is not authenticated and trying to access a private path, redirect to login
    if (isPrivatePath && !isAuthenticated) {
        const url = new URL("/login", request.url);
        url.searchParams.set("clearToken", "true");
        return NextResponse.redirect(url);
    }

    // if the user is authenticated and trying to access an unauthenticated path, redirect to home
    if (isUnAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // if the user is authenticated and trying to access a private path, check the Role
    if (isAccessTokenValid && isAuthenticated) {
        const isManaPath = manaPath.some((path) => pathname.startsWith(path));
        const isGuestPath = guestPath.some((path) => pathname.startsWith(path));
        const isOnlyOwnerPath = onlyOwnerPath.some((path) => pathname.startsWith(path));

        const { role } = decodeJwt<TokenPayload>(accessToken);

        // if the user is trying to access an only owner path and does not have the owner role, redirect to home
        if (isOnlyOwnerPath && role !== Role.Owner) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        // if the user is trying to access a management path and does not have the required role, redirect to guest menu
        if (isManaPath && role !== Role.Owner && role !== Role.Employee) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        // if the user is trying to access a guest path and does not have the guest role, redirect to management dashboard
        if (isGuestPath && role !== Role.Guest) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/manage/:path*", "/login", "/register", "/guest/:path*"],
};
