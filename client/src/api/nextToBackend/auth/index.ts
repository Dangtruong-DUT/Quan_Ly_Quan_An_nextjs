import http from "@/service/api/http";
import {
    LoginBodyType,
    LoginResType,
    LogoutBodyType,
    RefreshTokenBodyType,
    RefreshTokenResType,
} from "@/utils/validation/auth.schema";

const nextRequestAuthApi = {
    nextLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
    nextLogout: (body: LogoutBodyType, accessToken: string) =>
        http.post("/auth/logout", body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
    nextRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>("/auth/refresh-token", body),
};
export default nextRequestAuthApi;
