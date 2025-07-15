import nextRequestAuthApi from "@/api/nextToBackend/auth";
import { HttpStatus } from "@/constants/httpStatus";
import { httpError } from "@/service/api/http";
import { TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
    const cookiesStore = await cookies();
    const oldRefreshToken = cookiesStore.get("refreshToken")?.value;
    if (!oldRefreshToken) {
        return new Response(JSON.stringify({ message: "No refresh token found." }), {
            status: HttpStatus.UNAUTHORIZED_STATUS,
            headers: { "Content-Type": "application/json" },
        });
    }
    try {
        const { payload } = await nextRequestAuthApi.nextRefreshToken({
            refreshToken: oldRefreshToken,
        });
        const { accessToken, refreshToken } = payload.data;
        const decodedAccessToken = decodeJwt<TokenPayload>(accessToken);
        const decodedRefreshToken = decodeJwt<TokenPayload>(refreshToken);
        cookiesStore.set("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            expires: new Date(decodedAccessToken.exp * 1000),
            secure: true,
            path: "/",
        });
        cookiesStore.set("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            expires: new Date(decodedRefreshToken.exp * 1000),
            secure: true,
            path: "/",
        });
        return NextResponse.json(payload, { status: HttpStatus.OK_STATUS });
    } catch (error) {
        if (error instanceof httpError) {
            return NextResponse.json(error.payload, { status: error.status });
        } else {
            console.error("refresh token error:", error);
            return NextResponse.json(
                { message: "An unexpected error occurred during refresh token." },
                { status: HttpStatus.INTERNALS_SERVER_sTATUS }
            );
        }
    }
}
