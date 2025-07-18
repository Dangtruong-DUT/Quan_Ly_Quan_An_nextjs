import nextRequestAuthApi from "@/api/nextToBackend/auth";
import { HttpStatus } from "@/constants/httpStatus";
import { httpError } from "@/service/api/http";
import { TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";
import { LoginBodyType } from "@/utils/validation/auth.schema";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = (await request.json()) as LoginBodyType;
    const cookieStory = await cookies();
    try {
        const { payload } = await nextRequestAuthApi.nextLogin(body);
        const { accessToken, refreshToken } = payload.data;
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
        return NextResponse.json(payload);
    } catch (error) {
        if (error instanceof httpError) {
            return NextResponse.json(error.payload, { status: error.status });
        } else {
            console.error("Login error:", error);
            return NextResponse.json(
                { message: "An unexpected error occurred during login." },
                { status: HttpStatus.INTERNAL_SERVER_STATUS }
            );
        }
    }
}
