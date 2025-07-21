import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/app/[locale]/(public)/(auth)/login/login-form";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Locale } from "@/i18n/config";
import { Metadata } from "next";
import envConfig from "@/config/app.config";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const typedLocale = locale as "en" | "vi";
    const t = await getTranslations({ locale: typedLocale, namespace: "Metadata" });

    return {
        title: t("login.title"),
        description: t("login.description"),
        authors: [{ name: t("author.name"), url: t("author.url") }],
        keywords: t("login.keywords")
            .split(",")
            .map((keyword) => keyword.trim()),
        openGraph: {
            title: t("login.title"),
            description: t("login.description"),
            locale,
            type: "website",
            url: `${envConfig.NEXT_PUBLIC_URL}/${locale}`,
            siteName: "TaplamIT - Restaurant Management Software",
            images: [
                {
                    url: `${envConfig.NEXT_PUBLIC_URL}/banner.png`,
                    width: 1200,
                    height: 630,
                    alt: "TaplamIT - Restaurant Management Software",
                },
            ],
        },
    };
}

export default async function Login({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale as Locale);
    const t = await getTranslations("LoginPage");

    return (
        <div>
            <Card className=" mx-auto max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        <h1>{t("title")}</h1>
                    </CardTitle>
                    <CardDescription>{t("description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                </CardContent>
            </Card>
        </div>
    );
}
