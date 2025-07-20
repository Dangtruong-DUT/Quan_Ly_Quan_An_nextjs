import http from "@/services/api/http";
import {
    CreateTableBodyType,
    TableListResType,
    TableResType,
    UpdateTableBodyType,
} from "@/utils/validation/table.schema";

const clientRequestTableApi = {
    add: (body: CreateTableBodyType) => http.post<TableResType>("/tables", body),
    list: () => http.get<TableListResType>("/tables"),
    getDish: (id: number) => http.get<TableResType>(`/tables/${id}`),
    update: ({ id, body }: { id: number; body: UpdateTableBodyType }) => http.put<TableResType>(`/tables/${id}`, body),
    delete: (id: number) => http.delete<TableResType>(`/tables/${id}`),
};

export default clientRequestTableApi;
