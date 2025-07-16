import http from "@/service/api/http";
import {
    AccountListResType,
    AccountResType,
    ChangePasswordBodyType,
    CreateEmployeeAccountBodyType,
    CreateGuestBodyType,
    CreateGuestResType,
    GetGuestListQueryParamsType,
    GetListGuestsResType,
    UpdateEmployeeAccountBodyType,
    UpdateMeBodyType,
} from "@/utils/validation/account.schema";
import queryString from "query-string";

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
    getListGuest: (queryParams?: GetGuestListQueryParamsType) => {
        const query = queryParams
            ? `?${queryString.stringify({
                  fromDate: queryParams.fromDate ? queryParams.fromDate.toISOString() : undefined,
                  toDate: queryParams.toDate ? queryParams.toDate.toISOString() : undefined,
              })}`
            : "";
        return http.get<GetListGuestsResType>(`/accounts/guests${query}`);
    },
    createGuest: (body: CreateGuestBodyType) => http.post<CreateGuestResType>("/accounts/guests", body),
};
export default clientRequestAccountApi;
