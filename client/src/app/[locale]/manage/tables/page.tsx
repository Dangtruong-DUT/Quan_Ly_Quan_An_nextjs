import TableTable from "@/app/[locale]/manage/tables/_components/table-table";
import TableTableProvider from "@/app/[locale]/manage/tables/context/TableTableContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale } from "@/i18n/config";
import { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

export const metadata: Metadata = {
    title: "Manage Tables",
    description: "Manage your restaurant tables",
    keywords: "manage, restaurant, tables",
};

export default async function TablesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    // Enable static rendering
    setRequestLocale(locale as Locale);
    const t = await getTranslations("TablesPage");

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                        <CardDescription>{t("description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TableTableProvider>
                            <TableTable />
                        </TableTableProvider>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
