import http from "@/service/api/http";
import { SetCookieBodyType } from "@/types/auth";
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
    setCookie: (body: SetCookieBodyType) =>
        http.post("/api/auth/token", body, {
            baseUrl: "",
        }),
};
export default clientRequestAuthApi;
