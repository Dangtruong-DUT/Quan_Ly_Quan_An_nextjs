import clientRequestAccountApi from "@/api/clientToServer/accounts";
import { clientSessionToken } from "@/services/storage/clientSessionToken";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useAccountProfile() {
    const refreshToken = clientSessionToken.refreshToken;
    return useQuery({
        queryKey: ["accountProfile", refreshToken],
        queryFn: clientRequestAccountApi.me,
        staleTime: 1000 * 60 * 5,
        enabled: Boolean(refreshToken),
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

export function useGetListGuestQuery(queryParams?: { fromDate?: Date; toDate?: Date }) {
    return useQuery({
        queryKey: ["guestList", queryParams],
        queryFn: () => clientRequestAccountApi.getListGuest(queryParams),
        staleTime: 1000 * 60 * 5,
    });
}

export function useCreateGuestMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestAccountApi.createGuest,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["guestList"] });
        },
    });
}
