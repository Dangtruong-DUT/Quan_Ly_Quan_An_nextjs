import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const AccountRequestApi = {
    me: () => http.get<AccountResType>("/accounts/me"),
    nextMe: (accessToken: string) =>
        http.get<AccountResType>("/account/me", {
            baseUrl: "",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
};
export default AccountRequestApi;
