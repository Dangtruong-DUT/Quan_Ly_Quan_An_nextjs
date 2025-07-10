import MediaRequestApi from "@/apiRequest/media.request";
import { useMutation } from "@tanstack/react-query";

export function useUploadMediaMutation() {
    return useMutation({
        mutationFn: MediaRequestApi.upload,
    });
}
