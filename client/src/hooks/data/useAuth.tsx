import clientRequestAuthApi from "@/api/clientToServer/auth";
import { useMutation } from "@tanstack/react-query";

export function useLoginMutation() {
    return useMutation({
        mutationFn: clientRequestAuthApi.login,
    });
}

export function useLogoutMutation() {
    return useMutation({
        mutationFn: clientRequestAuthApi.logout,
    });
}
