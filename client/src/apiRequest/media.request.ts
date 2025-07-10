import http from "@/lib/http";
import { UploadImageResType } from "@/schemaValidations/media.schema";

const MediaRequestApi = {
    upload: (body: FormData) => http.post<UploadImageResType>("/media/upload", body),
};

export default MediaRequestApi;
