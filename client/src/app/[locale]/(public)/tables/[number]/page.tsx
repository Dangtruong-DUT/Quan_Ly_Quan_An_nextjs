import GuestLoginForm from "@/app/[locale]/(public)/tables/[number]/guest-login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale } from "@/i18n/config";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function TableNumberPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale as Locale);
    const t = await getTranslations("GuestLoginPage");

    return (
        <div>
            <Card className="mx-auto  max-w-[300px]  sm:max-w-[600px] space-y-2 w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">{t("title")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <GuestLoginForm />
                </CardContent>
            </Card>
        </div>
    );
}
