import clientRequestGuestApi from "@/api/clientToServer/guest";
import { useMutation } from "@tanstack/react-query";

// This hook is used to handle guest login functionality
export function useGuestLoginMutation() {
    return useMutation({
        mutationFn: clientRequestGuestApi.login,
    });
}
// This hook is used to handle guest logout functionality
export function useLogoutMutation() {
    return useMutation({
        mutationFn: clientRequestGuestApi.logout,
    });
}
