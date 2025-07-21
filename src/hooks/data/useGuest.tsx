import clientRequestGuestApi from "@/api/clientToServer/guest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// This hook is used to handle guest login functionality
export function useGuestLoginMutation() {
    return useMutation({
        mutationFn: clientRequestGuestApi.login,
    });
}
// This hook is used to handle guest logout functionality
export function useGuestLogoutMutation() {
    return useMutation({
        mutationFn: clientRequestGuestApi.logout,
    });
}
export function useGuestGetOrderListQuery() {
    return useQuery({
        queryKey: ["guest_orderList"],
        queryFn: clientRequestGuestApi.getOrderList,
        staleTime: 1000 * 60 * 5,
    });
}

export function useGuestOrderMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestGuestApi.order,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guest_orderList"] });
        },
    });
}
