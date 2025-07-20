import OrderCard from "@/app/[locale]/guest/order/order-card";
import { Locale } from "@/i18n/config";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function OrderPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;

    // Enable static rendering
    setRequestLocale(locale as Locale);
    const t = await getTranslations("OrderPage");

    return (
        <div className="max-w-[400px] mx-auto space-y-4">
            <h1 className="text-center text-xl font-bold">{t("title")}</h1>
            <OrderCard />
        </div>
    );
}
