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
