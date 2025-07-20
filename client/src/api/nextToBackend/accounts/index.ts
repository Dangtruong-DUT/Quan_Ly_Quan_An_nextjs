import http from "@/services/api/http";
import { AccountResType } from "@/utils/validation/account.schema";

const nextRequestAccountApi = {
    nexMe: (accessToken: string) =>
        http.get<AccountResType>("/accounts/me", {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
};
export default nextRequestAccountApi;
