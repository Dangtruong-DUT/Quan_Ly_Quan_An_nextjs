import NextTopLoader from "nextjs-toploader";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import AppProvider from "@/providers/app-provider";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import envConfig from "@/config/app.config";
import Footer from "@/components/footer";
import GoogleTags from "@/components/google-tags";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const typedLocale = locale as "en" | "vi";
    const t = await getTranslations({ locale: typedLocale, namespace: "Metadata" });

    return {
        title: {
            template: "%s | TaplamIT - Restaurant Management Software",
            default: "TaplamIT - Restaurant Management Software",
        },
        description: t("description"),
        authors: [{ name: t("author.name"), url: t("author.url") }],
        keywords: t("keywords")
            .split(",")
            .map((keyword) => keyword.trim()),
        openGraph: {
            title: t("title"),
            description: t("description"),
            locale,
            type: "website",
            url: `${envConfig.NEXT_PUBLIC_URL}/${locale}`,
            siteName: "TaplamIT - Restaurant Management Software",
            images: [
                {
                    url: `${envConfig.NEXT_PUBLIC_URL}/banner.png`,
                    width: 1200,
                    height: 630,
                    alt: "TaplamIT - Restaurant Management Software",
                },
            ],
        },
        creator: t("author.name"),
        publisher: t("author.name"),
        alternates: {
            canonical: "/",
            languages: {
                "en-US": "/en-US",
                "vi-VN": "/vi-VN",
            },
        },
        formatDetection: {
            email: false,
            address: false,
            telephone: false,
        },
        other: {
            "google-site-verification": "Lrh8-A7d1Il0KBtPwQQoCRip8eOfyZTW1XfXvGlDqcI",
        },
    };
}

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${inter.variable} antialiased`}>
                <NextIntlClientProvider>
                    <AppProvider>
                        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
                            <NextTopLoader color="var(--foreground)" showSpinner={false} />
                            {children}
                            <Footer />
                            <Toaster />
                        </ThemeProvider>
                    </AppProvider>
                </NextIntlClientProvider>
                <GoogleTags />
            </body>
        </html>
    );
}
