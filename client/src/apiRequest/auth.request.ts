import http from "@/lib/http";
import { LoginBodyType, LoginResType, LogoutBodyType } from "@/schemaValidations/auth.schema";

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
};
export default AuthRequestApi;
