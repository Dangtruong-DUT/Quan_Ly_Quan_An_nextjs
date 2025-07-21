import clientRequestDishesApi from "@/api/clientToServer/dishes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetDishes() {
    return useQuery({
        queryKey: ["dishes"],
        queryFn: () => clientRequestDishesApi.list(),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useGetDishDetail({ id }: { id?: number }) {
    return useQuery({
        queryKey: ["dish", id],
        queryFn: () => clientRequestDishesApi.getDish(id!),
        enabled: !!id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
}

export function useAddDishMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestDishesApi.add,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dishes"] });
        },
    });
}

export function useUpdateDishMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestDishesApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dishes"] });
        },
    });
}

export function useDeleteDishMutation() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestDishesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dishes"] });
        },
    });
}

export function useEditDishMutation({ id }: { id?: number }) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: clientRequestDishesApi.update,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["dishes"] });
            if (id != undefined) queryClient.invalidateQueries({ queryKey: ["dish", id] });
        },
    });
}
