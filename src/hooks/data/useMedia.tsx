import clientRequestMediaApi from "@/api/clientToServer/media";
import { useMutation } from "@tanstack/react-query";

export function useUploadMediaMutation() {
    return useMutation({
        mutationFn: clientRequestMediaApi.upload,
    });
}
