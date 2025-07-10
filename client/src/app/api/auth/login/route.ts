import AuthRequestApi from "@/apiRequest/auth.request";
import { HttpStatus } from "@/constants/httpStatus";
import { httpError } from "@/lib/http";
import { decodeJwt } from "@/lib/jwt";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = (await request.json()) as LoginBodyType;
    const cookieStory = await cookies();
    try {
        const { payload } = await AuthRequestApi.nextLogin(body);
        const { accessToken, refreshToken } = payload.data;
        const decodedAccessToken = decodeJwt<{ exp: number }>(accessToken);
        const decodedRefreshToken = decodeJwt<{ exp: number }>(refreshToken);
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
        return NextResponse.json(payload);
    } catch (error) {
        if (error instanceof httpError) {
            return NextResponse.json(error.payload, { status: error.status });
        } else {
            console.error("Login error:", error);
            return NextResponse.json(
                { message: "An unexpected error occurred during login." },
                { status: HttpStatus.INTERNALS_SERVER_sTATUS }
            );
        }
    }
}
