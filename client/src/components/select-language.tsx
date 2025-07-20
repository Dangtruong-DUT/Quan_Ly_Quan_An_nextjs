"use client";

import * as React from "react";

import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLocale, useTranslations } from "next-intl";
import { LANGUAGES, Locale } from "@/i18n/config";
import { setUserLocale } from "@/services/locale";

export function SelectLanguage() {
    const t = useTranslations();
    const locale = useLocale();

    function onChange(value: string) {
        const locale = value as Locale;
        React.startTransition(() => {
            setUserLocale(locale);
        });
    }

    return (
        <Select value={locale} onValueChange={onChange}>
            <SelectTrigger className="w-[150px]">
                <SelectValue placeholder={t("SwitchLanguage.label")} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>{t("SwitchLanguage.label")}</SelectLabel>
                    {LANGUAGES.map(({ value, labelKey }) => (
                        <SelectItem key={value} value={value}>
                            {t(labelKey)}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
