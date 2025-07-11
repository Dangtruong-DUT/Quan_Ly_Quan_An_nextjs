import http from "@/lib/http";
import { AccountResType, ChangePasswordBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";

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
    changePassword: (body: ChangePasswordBodyType) => http.put<AccountResType>("/accounts/change-password", body),
};
export default AccountRequestApi;
