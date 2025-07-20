import DropdownAvatar from "@/app/[locale]/manage/_components/dropdown-avatar";
import MobileNavLinks from "@/app/[locale]/manage/_components/mobile-nav-links";
import NavLinks from "@/app/[locale]/manage/_components/nav-links";
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import SelectLanguage from "@/components/select-language";
import { Locale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { use } from "react";

export default function Layout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = use(params);

    // Enable static rendering
    setRequestLocale(locale as Locale);

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <NavLinks />
            <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                    <MobileNavLinks />
                    <div className="relative ml-auto flex-1 md:grow-0">
                        <div className="flex justify-end space-x-4">
                            <SelectLanguage />
                            <DarkModeToggle />
                        </div>
                    </div>
                    <DropdownAvatar />
                </header>
                {children}
            </div>
        </div>
    );
}
