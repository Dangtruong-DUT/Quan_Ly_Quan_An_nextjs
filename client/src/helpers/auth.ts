import clientRequestAuthApi from "@/api/clientToServer/auth";
import clientRequestGuestApi from "@/api/clientToServer/guest";
import { Role } from "@/constants/type";
import { clientSessionToken } from "@/service/storage/clientSessionToken";
import { TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";
import { RefreshTokenResType } from "@/utils/validation/auth.schema";

/**
 * Handles the refresh token logic.
 * If the access token is expired or about to expire, it fetches a new access token using the refresh token.
 * If the refresh token is also expired, it clears the session tokens.
 * @param {Object} params - Optional parameters for success and error callbacks.
 * @param {Function} params.onSuccess - Callback function to execute on successful token refresh.
 * @param {Function} params.onError - Callback function to execute on error during token refresh.
 * @param {Function} params.onRefreshTokenExpired - Callback function to execute when the refresh token is expired.
 */

export async function handleRefreshToken(params?: {
    onSuccess?: (data: RefreshTokenResType) => void;
    onError?: (error: unknown) => void;
    onRefreshTokenExpired?: () => void;
    force?: boolean;
}) {
    const accessToken = clientSessionToken.accessToken;
    const refreshToken = clientSessionToken.refreshToken;
    if (!accessToken || !refreshToken) return;

    const decodeAccessToken = decodeJwt<TokenPayload>(accessToken);
    const decodeRefreshToken = decodeJwt<TokenPayload>(refreshToken);

    const refreshFn =
        decodeRefreshToken.role === Role.Guest ? clientRequestGuestApi.refreshToken : clientRequestAuthApi.refreshToken;

    const currentTime = Date.now() / 1000 - 1; // Subtract 1 second to account for any potential delay in token expiration checks
    if (decodeRefreshToken.exp <= currentTime) {
        clientSessionToken.clear();
        return params?.onRefreshTokenExpired?.();
    }
    // If the access token is still valid for more than 1/3 of its lifetime, skip the refresh logic
    if (!params?.force && decodeAccessToken.exp - currentTime > (decodeAccessToken.exp - decodeAccessToken.iat) / 3)
        return;

    try {
        const res = await refreshFn();

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.payload.data;
        clientSessionToken.accessToken = newAccessToken;
        clientSessionToken.refreshToken = newRefreshToken;
        params?.onSuccess?.(res.payload);
    } catch (error) {
        params?.onError?.(error);
    }
}
