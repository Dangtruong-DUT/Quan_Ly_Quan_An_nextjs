import http from "@/lib/http";
import { AccountResType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

const AccountRequestApi = {
    me: () => http.get<AccountResType>("/accounts/me"),
    nextMe: (accessToken: string) =>
        http.get<AccountResType>("/account/me", {
            baseUrl: "",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>("/accounts/me", body),
};
export default AccountRequestApi;
