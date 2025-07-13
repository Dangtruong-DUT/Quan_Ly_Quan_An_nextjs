import http from "@/service/api/http";
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from "@/utils/validation/dish.schema";

const clientRequestDishesApi = {
    add: (body: CreateDishBodyType) => http.post<DishResType>("/dishes", body),
    list: () => http.get<DishListResType>("/dishes"),
    getDish: (id: number) => http.get<DishResType>(`/dishes/${id}`),
    update: ({ id, body }: { id: number; body: UpdateDishBodyType }) => http.put<DishResType>(`/dishes/${id}`, body),
    delete: (id: number) => http.delete<DishResType>(`/dishes/${id}`),
};

export default clientRequestDishesApi;
