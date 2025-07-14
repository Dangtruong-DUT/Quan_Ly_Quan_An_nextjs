import http from "@/service/api/http";
import { DishListResType } from "@/utils/validation/dish.schema";

const nextRequestDishesApi = {
    nextList: () =>
        http.get<DishListResType>("/dishes", {
            cache: "force-cache",
            next: { tags: ["dishes"] },
        }),
};

export default nextRequestDishesApi;
