export function formatNumberWithSuffix(value: number): string {
    const formatter = new Intl.NumberFormat("en", {
        notation: "compact",
        compactDisplay: "short",
    });

    return formatter.format(value);
}
