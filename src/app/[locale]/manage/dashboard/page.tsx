import DashboardMain from "@/app/[locale]/manage/dashboard/dashboard-main";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale } from "@/i18n/config";
import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

export const metadata: Metadata = {
    title: "Manage Dashboard",
    description: "Manage your restaurant settings",
    keywords: "manage, restaurant, settings",
};

export default async function Dashboard({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    // Enable static rendering
    setRequestLocale(locale as Locale);
    const t = await getTranslations("DashboardPage");

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                        <CardDescription>{t("description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DashboardMain />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
