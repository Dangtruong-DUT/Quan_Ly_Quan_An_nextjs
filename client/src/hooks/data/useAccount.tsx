import clientRequestAccountApi from "@/api/clientToServer/accounts";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAccountProfile() {
    return useQuery({
        queryKey: ["accountProfile"],
        queryFn: clientRequestAccountApi.me,
        staleTime: 1000 * 60 * 5,
    });
}

export function useUpdateAccountProfileMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestAccountApi.updateMe,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accountProfile"] });
        },
    });
}

export function useChangePasswordMutation() {
    return useMutation({
        mutationFn: clientRequestAccountApi.changePassword,
    });
}

export function useGetAccountList() {
    return useQuery({
        queryKey: ["accountList"],
        queryFn: clientRequestAccountApi.list,
        staleTime: 1000 * 60 * 5,
    });
}

export function useGetEmployeeDetail({ id }: { id?: number }) {
    return useQuery({
        queryKey: ["employeeDetail", id],
        queryFn: () => clientRequestAccountApi.getEmployeeDetail(id!),
        staleTime: 1000 * 60 * 5,
        enabled: Boolean(id),
    });
}
export function useAddEmployeeMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestAccountApi.AddEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accountList"] });
        },
    });
}
export function useEditEmployeeMutation({ id }: { id?: number }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestAccountApi.EditEmployee,

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accountList"] });
            if (id != undefined) queryClient.invalidateQueries({ queryKey: ["employeeDetail", id] });
        },
    });
}

export function useDeleteEmployeeMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestAccountApi.DeleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accountList"] });
        },
    });
}
