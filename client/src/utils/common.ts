import { handleErrorApiOnNextServer } from "@/utils/handleError";

export function removeAccents(str: string) {
    return str
        .normalize("NFD") // 1. Tách chữ và dấu (ex: "ế" => "e + ́")
        .replace(/[\u0300-\u036f]/g, "") // 2. Xóa các ký tự dấu (tổ hợp Unicode)
        .replace(/đ/g, "d") // 3. Chuyển "đ" → "d"
        .replace(/Đ/g, "D"); //    Chuyển "Đ" → "D"
}
export const simpleMatchText = (fullText: string, matchText: string) => {
    return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()));
};

type WrapperServerCallApiProps<T> = {
    apiCallFn: () => Promise<T>;
    onError?: (error: unknown) => void;
    onSuccess?: (data: T) => void;
};

export const WrapperServerCallApi = async <T>({
    apiCallFn,
    onError,
    onSuccess,
}: WrapperServerCallApiProps<T>): Promise<null | T> => {
    let result: null | T = null;
    try {
        result = await apiCallFn();
        onSuccess?.(result);
    } catch (error) {
        handleErrorApiOnNextServer(error);
        onError?.(error);
    }
    return result;
};
