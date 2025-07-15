import clientRequestOrderApi from "@/api/clientToServer/order";
import { GetOrdersQueryParamsType } from "@/utils/validation/order.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useUpdateOrderMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestOrderApi.updateOrder,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["orderList"] });
        },
    });
}
export function useGetOrderListQuery(queryParams?: GetOrdersQueryParamsType) {
    return useQuery({
        queryKey: ["orderList", queryParams],
        queryFn: () => clientRequestOrderApi.getOrderList(queryParams),
    });
}

export function useGetOrderDetailQuery(orderId?: number) {
    return useQuery({
        queryKey: ["orderDetail", orderId],
        queryFn: () => clientRequestOrderApi.getOrderDetail(orderId!),
        enabled: !!orderId,
    });
}
