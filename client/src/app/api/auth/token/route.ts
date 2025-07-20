import { HttpStatus } from "@/constants/httpStatus";
import { httpError } from "@/services/api/http";
import { SetCookieBodyType } from "@/types/auth";
import { TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = (await request.json()) as SetCookieBodyType;
    const cookieStory = await cookies();
    try {
        const { accessToken, refreshToken } = body;
        if (!accessToken || !refreshToken) {
            throw new httpError({
                status: HttpStatus.BAD_REQUEST_STATUS,
                message: "Access token and refresh token are required.",
                payload: { error: "Missing tokens" },
            });
        }
        const decodedAccessToken = decodeJwt<TokenPayload>(accessToken);
        const decodedRefreshToken = decodeJwt<TokenPayload>(refreshToken);
        cookieStory.set("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "lax",
            expires: new Date(decodedAccessToken.exp * 1000),
            secure: true,
            path: "/",
        });
        cookieStory.set("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            expires: new Date(decodedRefreshToken.exp * 1000),
            secure: true,
            path: "/",
        });
        return NextResponse.json(body);
    } catch (error) {
        if (error instanceof httpError) {
            return NextResponse.json(error.message, { status: error.status });
        } else {
            console.error("Login error:", error);
            return NextResponse.json(
                { message: "An unexpected error occurred during login." },
                { status: HttpStatus.INTERNAL_SERVER_STATUS }
            );
        }
    }
}
