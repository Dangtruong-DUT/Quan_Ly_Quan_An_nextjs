import AccountRequestApi from "@/apiRequest/account.request";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useAccountProfile() {
    return useQuery({
        queryKey: ["accountProfile"],
        queryFn: AccountRequestApi.me,
        staleTime: 1000 * 60 * 5,
    });
}

export function useUpdateAccountProfileMutation() {
    return useMutation({
        mutationFn: AccountRequestApi.updateMe,
    });
}

export function useChangePasswordMutation() {
    return useMutation({
        mutationFn: AccountRequestApi.changePassword,
    });
}
