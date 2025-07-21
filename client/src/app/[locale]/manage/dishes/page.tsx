import DishTable from "@/app/[locale]/manage/dishes/_components/dish-table";
import DishTableProvider from "@/app/[locale]/manage/dishes/context/DishTableContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale } from "@/i18n/config";
import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

export const metadata: Metadata = {
    title: "Manage Dishes",
    description: "Manage your restaurant dishes",
    keywords: "manage, restaurant, dishes",
};

export default async function DishesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    // Enable static rendering
    setRequestLocale(locale as Locale);
    const t = await getTranslations("DishesPage");

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                        <CardDescription>{t("description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DishTableProvider>
                            <DishTable />
                        </DishTableProvider>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
