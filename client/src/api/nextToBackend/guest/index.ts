import http from "@/services/api/http";
import { RefreshTokenBodyType, RefreshTokenResType } from "@/utils/validation/auth.schema";
import { GuestLoginBodyType, GuestLoginResType } from "@/utils/validation/guest.schema";

const nextRequestGuestApi = {
    nextGuestLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>("/guest/auth/login", body),
    nextGuestRefreshToken: (body: RefreshTokenBodyType) =>
        http.post<RefreshTokenResType>("/guest/auth/refresh-token", body),
    nextGuestLogout: (body: RefreshTokenBodyType, accessToken: string) =>
        http.post<RefreshTokenResType>("/guest/auth/logout", body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
};
export default nextRequestGuestApi;
