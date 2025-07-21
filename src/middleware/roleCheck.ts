import { Role } from "@/constants/type";
import { TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";
import { NextRequest, NextResponse } from "next/server";
import { manaPath, guestPath, onlyOwnerPath } from "./pathCheck";

export function handleRoleAccess(accessToken: string, pathname: string, request: NextRequest): NextResponse | null {
    const { role } = decodeJwt<TokenPayload>(accessToken);

    const isManaPath = manaPath.some((path) => pathname.startsWith(path));
    const isGuestPath = guestPath.some((path) => pathname.startsWith(path));
    const isOnlyOwnerPath = onlyOwnerPath.some((path) => pathname.startsWith(path));

    if (isOnlyOwnerPath && role !== Role.Owner) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isManaPath && role !== Role.Owner && role !== Role.Employee) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (isGuestPath && role !== Role.Guest) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return null;
}
