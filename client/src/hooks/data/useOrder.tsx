import clientRequestOrderApi from "@/api/clientToServer/order";
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
export function useGetOrderListQuery() {
    return useQuery({
        queryKey: ["orderList"],
        queryFn: clientRequestOrderApi.getOrderList,
    });
}
