import http from "@/service/api/http";
import { GuestLoginBodyType, GuestLoginResType } from "@/utils/validation/guest.schema";

const clientRequestGuestApi = {
    login: (body: GuestLoginBodyType) =>
        http.post<GuestLoginResType>("/api/guest/auth/logout", body, {
            baseUrl: "",
        }),
    logout: () =>
        http.post("/api/guest/auth/logout", null, {
            baseUrl: "",
        }),
    refreshToken: () =>
        http.post("/api/guest/auth/refresh-token", null, {
            baseUrl: "",
        }),
};
export default clientRequestGuestApi;
