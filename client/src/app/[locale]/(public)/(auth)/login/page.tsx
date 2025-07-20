import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/config";

export default async function Login({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale as Locale);
    const t = await getTranslations("LoginPage");

    return (
        <div>
            <Card className=" mx-auto max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">{t("title")}</CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}
