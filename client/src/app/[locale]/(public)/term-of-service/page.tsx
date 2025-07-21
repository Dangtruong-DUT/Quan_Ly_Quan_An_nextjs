import { useTranslations } from "next-intl";

export default function TermsOfService() {
    const t = useTranslations("TermsOfServicePage");

    return (
        <div className="flex flex-col">
            <section className="bg-secondary py-20 px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl text-center">
                    <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">{t("title")}</h1>
                </div>
            </section>
            <section className="py-12 md:py-20 lg:py-24">
                <div className="max-w-4xl space-y-8">
                    <div>
                        <h2 className="text-3xl font-bold">{t("introduction")}</h2>
                        <p className="mt-4 text-muted-foreground leading-8">{t("introductionDescription")}</p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">{t("serviceUsage")}</h2>
                        <p className="text-muted-foreground leading-8">{t("serviceUsageDescription")}</p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">{t("intellectualProperty")}</h2>
                        <p className="text-muted-foreground leading-8">{t("intellectualPropertyDescription")}</p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">{t("termsChanges")}</h2>
                        <p className="text-muted-foreground leading-8">{t("termsChangesDescription")}</p>
                    </div>
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold">{t("contact")}</h2>
                        <p className="text-muted-foreground leading-8">{t("contactDescription")}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
