import clientRequestTableApi from "@/api/clientToServer/tables";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetTables() {
    return useQuery({
        queryKey: ["tables"],
        queryFn: () => clientRequestTableApi.list(),
    });
}

export function useGetTableDetail({ id }: { id?: number }) {
    return useQuery({
        queryKey: ["table", id],
        queryFn: () => clientRequestTableApi.getDish(id!),
        enabled: !!id,
    });
}
export function useAddTableMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestTableApi.add,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
    });
}

export function useUpdateTableMutation({ id }: { id?: number }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestTableApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tables"] });
            if (id != undefined) queryClient.invalidateQueries({ queryKey: ["table", id] });
        },
    });
}

export function useDeleteTableMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestTableApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tables"] });
        },
    });
}
