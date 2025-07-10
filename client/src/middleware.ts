import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const privatePath = ["/manage"];
const unAuthPath = ["/login", "/register"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const accessToken = request.cookies.get("accessToken")?.value;
    const isAuthenticated = Boolean(accessToken);
    const isPrivatePath = privatePath.some((path) => pathname.startsWith(path));
    const isUnAuthPath = unAuthPath.some((path) => pathname.startsWith(path));

    if (isPrivatePath && !isAuthenticated) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
    if (isUnAuthPath && isAuthenticated) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/manage/:path*", "/login", "/register"],
};
