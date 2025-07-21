import AccountTable from "@/app/[locale]/manage/accounts/_components/account-table";
import AccountTableProvider from "@/app/[locale]/manage/accounts/context/account-table-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Locale } from "@/i18n/config";
import { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
    title: "Manage Accounts",
    description: "Manage your restaurant settings",
    keywords: "manage, restaurant, settings",
};

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
    // Enable static rendering
    const { locale } = await params;
    setRequestLocale(locale as Locale);
    const t = await getTranslations("AccountsPage");

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                        <CardDescription>{t("description")}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AccountTableProvider>
                            <AccountTable />
                        </AccountTableProvider>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
