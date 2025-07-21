import { useTranslations } from "next-intl";

export default function About() {
    const t = useTranslations("AboutPage");

    return (
        <div className="flex flex-col">
            <section className="bg-secondary py-20 px-4 md:px-6 lg:px-8">
                <div className="max-w-4xl text-center mx-auto">
                    <h1 className="text-4xl font-bold sm:text-5xl md:text-6xl">{t("title")}</h1>
                    <p className="mt-4 text-lg md:text-xl">{t("address")}</p>
                </div>
            </section>
            <section className="py-12 md:py-20 lg:py-24">
                <div className="max-w-4xl space-y-8 mx-auto">
                    <div>
                        <h2 className="text-3xl font-bold">{t("ourStory")}</h2>
                        <p className="mt-4 text-muted-foreground leading-8">{t("ourStoryDescription")}</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">{t("ourValues")}</h2>
                        <p className="mt-4 text-muted-foreground leading-8">{t("ourValuesDescription")}</p>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold">{t("ourCommitment")}</h2>
                        <p className="mt-4 text-muted-foreground leading-8">{t("ourCommitmentDescription")}</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
