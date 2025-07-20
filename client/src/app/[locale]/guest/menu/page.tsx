import MenuOrder from "@/app/[locale]/guest/menu/menu-order";
import { getTranslations } from "next-intl/server";

export default async function MenuPage() {
    const t = await getTranslations("MenuPage");

    return (
        <div className="max-w-[400px] mx-auto space-y-4">
            <h1 className="text-center text-xl font-bold">{t("title")}</h1>
            <MenuOrder />
        </div>
    );
}
