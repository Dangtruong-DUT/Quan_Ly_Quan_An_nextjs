export type Locale = (typeof locales)[number];

export const locales = ["en", "vi"] as const;
export const defaultLocale: Locale = "en";

export const LANGUAGES = [
    { value: "en", labelKey: "en" },
    { value: "vi", labelKey: "vi" },
];

// In this example the locale is read from a cookie. You could alternatively
// also read it from a database, backend service, or any other source.
export const HEADER_NAME = "NEXT-I18NEXT_LOCALE";
