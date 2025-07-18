import nextRequestAuthApi from "@/api/nextToBackend/auth";
import { HttpStatus } from "@/constants/httpStatus";
import { httpError } from "@/service/api/http";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(request: NextRequest) {
    try {
        const cookiesStore = await cookies();
        const accessToken = cookiesStore.get("accessToken")?.value;
        const refreshToken = cookiesStore.get("refreshToken")?.value;
        cookiesStore.delete("accessToken");
        cookiesStore.delete("refreshToken");
        if (!refreshToken || !accessToken) {
            return NextResponse.json(
                { message: "No access or refresh token found." },
                { status: HttpStatus.OK_STATUS }
            );
        }

        const res = await nextRequestAuthApi.nextLogout(
            {
                refreshToken,
            },
            accessToken
        );
        return NextResponse.json(res.payload);
    } catch (error) {
        if (error instanceof httpError) {
            return NextResponse.json(error.payload, { status: HttpStatus.OK_STATUS });
        } else {
            console.error("Logout error:", error);
            return NextResponse.json(
                { message: "An unexpected error occurred during logout." },
                { status: HttpStatus.OK_STATUS }
            );
        }
    }
}
