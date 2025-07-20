export type Locale = (typeof locales)[number];

export const locales = ["en", "vi"] as const;
export const defaultLocale: Locale = "en";

export const LANGUAGES = [
    { value: "en", labelKey: "SwitchLanguage.en" },
    { value: "vi", labelKey: "SwitchLanguage.vi" },
];
