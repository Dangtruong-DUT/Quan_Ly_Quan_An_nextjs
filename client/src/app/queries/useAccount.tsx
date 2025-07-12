import AccountRequestApi from "@/apiRequest/account.request";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAccountProfile() {
    return useQuery({
        queryKey: ["accountProfile"],
        queryFn: AccountRequestApi.me,
        staleTime: 1000 * 60 * 5,
    });
}

export function useUpdateAccountProfileMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AccountRequestApi.updateMe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accountProfile"] });
        },
    });
}

export function useChangePasswordMutation() {
    return useMutation({
        mutationFn: AccountRequestApi.changePassword,
    });
}

export function useGetAccountList() {
    return useQuery({
        queryKey: ["accountList"],
        queryFn: AccountRequestApi.list,
        staleTime: 1000 * 60 * 5,
    });
}

export function useGetEmployeeDetail(id: number) {
    return useQuery({
        queryKey: ["employeeDetail", id],
        queryFn: () => AccountRequestApi.getEmployeeDetail(id),
        staleTime: 1000 * 60 * 5,
    });
}
export function useAddEmployeeMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AccountRequestApi.AddEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accountList"] });
        },
    });
}
export function useEditEmployeeMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AccountRequestApi.EditEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accountList"] });
        },
    });
}

export function useDeleteEmployeeMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: AccountRequestApi.DeleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accountList"] });
        },
    });
}
