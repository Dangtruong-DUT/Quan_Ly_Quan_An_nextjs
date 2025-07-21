import GuestLoginForm from "@/app/[locale]/(public)/tables/[number]/guest-login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale } from "@/i18n/config";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const typedLocale = locale as "en" | "vi";
    const t = await getTranslations({ locale: typedLocale, namespace: "Metadata.guestLogin" });

    return {
        title: t("title"),
        description: t("description"),
        keywords: t("keywords")
            .split(",")
            .map((keyword) => keyword.trim()),
    };
}

export default async function TableNumberPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale as Locale);
    const t = await getTranslations("GuestLoginPage");

    return (
        <div>
            <Card className="mx-auto  max-w-[300px]  sm:max-w-[600px] space-y-2 w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        <h1>{t("title")}</h1>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <GuestLoginForm />
                </CardContent>
            </Card>
        </div>
    );
}
