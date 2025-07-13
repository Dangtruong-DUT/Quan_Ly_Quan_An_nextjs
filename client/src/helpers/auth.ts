import clientRequestAuthApi from "@/api/clientToServer/auth";
import { clientSessionToken } from "@/service/storage/clientSessionToken";
import { JwtPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";

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
        const res = await clientRequestAuthApi.refreshToken();
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.payload.data;
        clientSessionToken.accessToken = newAccessToken;
        clientSessionToken.refreshToken = newRefreshToken;
        params?.onSuccess?.();
    } catch (error) {
        params?.onError?.(error);
    }
}
