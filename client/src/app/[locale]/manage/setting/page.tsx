import ChangePasswordForm from "@/app/[locale]/manage/setting/change-password-form";
import UpdateProfileForm from "@/app/[locale]/manage/setting/update-profile-form";
import { Badge } from "@/components/ui/badge";
import { Locale } from "@/i18n/config";
import { setRequestLocale, getTranslations } from "next-intl/server";

export default async function Setting({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    setRequestLocale(locale as Locale);
    const t = await getTranslations("SettingPage");

    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="mx-auto grid w-full flex-1 auto-rows-max gap-4">
                <div className="flex items-center gap-4">
                    <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        {t("title")}
                    </h1>
                    <Badge variant="outline" className="ml-auto sm:ml-0">
                        {t("owner")}
                    </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2 md:gap-8">
                    <UpdateProfileForm />
                    <ChangePasswordForm />
                </div>
            </div>
        </main>
    );
}
