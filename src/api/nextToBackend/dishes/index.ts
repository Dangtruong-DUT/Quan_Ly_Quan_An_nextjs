import http from "@/services/api/http";
import { DishListResType, DishResType } from "@/utils/validation/dish.schema";

const nextRequestDishesApi = {
    nextList: () =>
        http.get<DishListResType>("/dishes", {
            cache: "force-cache",
            next: { tags: ["dishes"] },
        }),
    getDishById: (id: number) =>
        http.get<DishResType>(`/dishes/${id}`, {
            cache: "force-cache",
            next: { tags: [`dishID${id}`] },
        }),
};

export default nextRequestDishesApi;
