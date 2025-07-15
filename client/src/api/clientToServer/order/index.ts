import http from "@/service/api/http";
import { GetOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from "@/utils/validation/order.schema";

const clientRequestOrderApi = {
    getOrderList: () => http.get<GetOrdersResType>("/orders"),
    updateOrder: ({ orderId, body }: { orderId: number; body: UpdateOrderBodyType }) =>
        http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
};
export default clientRequestOrderApi;
