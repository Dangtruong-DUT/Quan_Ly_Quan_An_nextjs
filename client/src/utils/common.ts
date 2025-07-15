export function removeAccents(str: string) {
    return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
    return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()));
};
