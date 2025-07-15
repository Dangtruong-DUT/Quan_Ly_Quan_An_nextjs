import http from "@/service/api/http";
import { RefreshTokenResType } from "@/utils/validation/auth.schema";
import {
    GuestCreateOrdersBodyType,
    GuestCreateOrdersResType,
    GuestGetOrdersResType,
    GuestLoginBodyType,
    GuestLoginResType,
} from "@/utils/validation/guest.schema";

const clientRequestGuestApi = {
    login: (body: GuestLoginBodyType) =>
        http.post<GuestLoginResType>("/api/guest/auth/login", body, {
            baseUrl: "",
        }),
    logout: () =>
        http.post("/api/guest/auth/logout", null, {
            baseUrl: "",
        }),
    refreshToken: () =>
        http.post<RefreshTokenResType>("/api/guest/auth/refresh-token", null, {
            baseUrl: "",
        }),
    order: (body: GuestCreateOrdersBodyType) => http.post<GuestCreateOrdersResType>("/guest/orders", body),
    getOrderList: () => http.get<GuestGetOrdersResType>("/guest/orders"),
};
export default clientRequestGuestApi;
