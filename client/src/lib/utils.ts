import AuthRequestApi from "@/apiRequest/auth.request";
import { clientSessionToken, EntityError, httpError } from "@/lib/http";
import { decodeJwt } from "@/lib/jwt";
import { JwtPayload } from "@/types/jwt";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleErrorApi(error: unknown, setError?: UseFormSetError<any>) {
    console.log("Error in handleErrorApi:", error);
    if (error instanceof EntityError && setError) {
        const { errors } = error.payload;
        errors.forEach((error) => {
            setError(error.field, { type: "server", message: error.message });
        });
    } else if (error instanceof httpError) {
        if (error.status === 401) {
            return;
        }
        const { message } = error.payload;
        toast.error(message || "An error occurred", {
            description: "Please try again later.",
        });
    }
}

export function handleErrorApiOnNextServer(error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((error as any).digest?.includes("NEXT_REDIRECT")) throw error;
    console.error("Error fetching data:", error);
}

export async function handleRefreshToken(params?: {
    onSuccess?: () => void;
    onError?: (error: unknown) => void;
    onRefreshTokenExpired?: () => void;
}) {
    const accessToken = clientSessionToken.accessToken;
    const refreshToken = clientSessionToken.refreshToken;
    // If no tokens are available, skip the refresh logic
    if (!accessToken || !refreshToken) return;

    const decodeAccessToken = decodeJwt<JwtPayload>(accessToken);
    const decodeRefreshToken = decodeJwt<JwtPayload>(refreshToken);
    const currentTime = Date.now() / 1000 - 1; // Subtract 1 second to account for any potential delay in token expiration checks

    // If the refresh token is expired or the access token is still valid, skip the refresh logic
    if (decodeRefreshToken.exp <= currentTime) {
        clientSessionToken.clear();
        return params?.onRefreshTokenExpired?.();
    }
    // If the access token is still valid for more than 1/3 of its lifetime, skip the refresh logic
    if (decodeAccessToken.exp - currentTime > (decodeAccessToken.exp - decodeAccessToken.iat) / 3) return;

    try {
        const res = await AuthRequestApi.refreshToken();
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.payload.data;
        clientSessionToken.accessToken = newAccessToken;
        clientSessionToken.refreshToken = newRefreshToken;
        params?.onSuccess?.();
    } catch (error) {
        params?.onError?.(error);
    }
}
