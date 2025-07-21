import http from "@/services/api/http";
import { UploadImageResType } from "@/utils/validation/media.schema";

const clientRequestMediaApi = {
    upload: (body: FormData) => http.post<UploadImageResType>("/media/upload", body),
};

export default clientRequestMediaApi;
