import http from "@/lib/http";
import {
    LoginBodyType,
    LoginResType,
    LogoutBodyType,
    RefreshTokenBodyType,
    RefreshTokenResType,
} from "@/schemaValidations/auth.schema";

const AuthRequestApi = {
    nextLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
    login: (body: LoginBodyType) =>
        http.post<LoginResType>("/api/auth/login", body, {
            baseUrl: "",
        }),
    nextLogout: (body: LogoutBodyType, accessToken: string) =>
        http.post("/auth/logout", body, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
    logout: () =>
        http.post("/api/auth/logout", null, {
            baseUrl: "",
        }),
    refreshToken: () =>
        http.post<RefreshTokenResType>("/api/auth/refresh-token", null, {
            baseUrl: "",
        }),
    nextRefreshToken: (body: RefreshTokenBodyType) => http.post<RefreshTokenResType>("/auth/refresh-token", body, {}),
};
export default AuthRequestApi;
