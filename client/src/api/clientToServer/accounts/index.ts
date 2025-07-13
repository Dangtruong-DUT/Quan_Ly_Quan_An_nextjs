import http from "@/service/api/http";
import {
    AccountListResType,
    AccountResType,
    ChangePasswordBodyType,
    CreateEmployeeAccountBodyType,
    UpdateEmployeeAccountBodyType,
    UpdateMeBodyType,
} from "@/utils/validation/account.schema";

const clientRequestAccountApi = {
    me: () => http.get<AccountResType>("/accounts/me"),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>("/accounts/me", body),
    changePassword: (body: ChangePasswordBodyType) => http.put<AccountResType>("/accounts/change-password", body),
    list: () => http.get<AccountListResType>("/accounts"),
    AddEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>("/accounts", body),
    EditEmployee: ({ id, body }: { id: number; body: UpdateEmployeeAccountBodyType }) =>
        http.put<AccountResType>(`/accounts/detail/${id}`, body),
    DeleteEmployee: (id: number) => http.delete(`/accounts/detail/${id}`),
    getEmployeeDetail: (id: number) => http.get<AccountResType>(`/accounts/detail/${id}`),
};
export default clientRequestAccountApi;
