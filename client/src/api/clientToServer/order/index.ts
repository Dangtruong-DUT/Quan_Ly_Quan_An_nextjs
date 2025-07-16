import http from "@/service/api/http";
import {
    CreateOrdersBodyType,
    CreateOrdersResType,
    GetOrderDetailResType,
    GetOrdersQueryParamsType,
    GetOrdersResType,
    PayGuestOrdersBodyType,
    UpdateOrderBodyType,
    UpdateOrderResType,
} from "@/utils/validation/order.schema";
import queryString from "query-string";

const clientRequestOrderApi = {
    createOrders: (body: CreateOrdersBodyType) => http.post<CreateOrdersResType>("/orders", body),
    getOrderList: (queryParams?: GetOrdersQueryParamsType) => {
        const query = queryParams
            ? `?${queryString.stringify({
                  fromDate: queryParams.fromDate ? queryParams.fromDate.toISOString() : undefined,
                  toDate: queryParams.toDate ? queryParams.toDate.toISOString() : undefined,
              })}`
            : "";
        return http.get<GetOrdersResType>(`/orders${query}`);
    },
    updateOrder: ({ orderId, body }: { orderId: number; body: UpdateOrderBodyType }) =>
        http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
    getOrderDetail: (orderId: number) => {
        return http.get<GetOrderDetailResType>(`/orders/${orderId}`);
    },
    Pay: (body: PayGuestOrdersBodyType) => http.post(`/orders/pay`, body),
};
export default clientRequestOrderApi;
