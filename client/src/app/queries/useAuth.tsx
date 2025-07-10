import AuthRequestApi from "@/apiRequest/auth.request";
import { useMutation } from "@tanstack/react-query";

export function useLoginMutation() {
    return useMutation({
        mutationFn: AuthRequestApi.login,
    });
}
