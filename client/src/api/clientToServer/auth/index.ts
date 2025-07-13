import http from "@/service/api/http";
import { LoginBodyType, LoginResType, RefreshTokenResType } from "@/utils/validation/auth.schema";

const clientRequestAuthApi = {
    login: (body: LoginBodyType) =>
        http.post<LoginResType>("/api/auth/login", body, {
            baseUrl: "",
        }),
    logout: () =>
        http.post("/api/auth/logout", null, {
            baseUrl: "",
        }),
    refreshToken: () =>
        http.post<RefreshTokenResType>("/api/auth/refresh-token", null, {
            baseUrl: "",
        }),
};
export default clientRequestAuthApi;
