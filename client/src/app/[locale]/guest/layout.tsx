import Layout from "@/app/[locale]/(public)/layout";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

function GuestLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
    const { locale } = use(params);

    // Enable static rendering
    setRequestLocale(locale as Locale);

    return (
        <Layout modal={null} params={params}>
            {children}
        </Layout>
    );
}

export default GuestLayout;
