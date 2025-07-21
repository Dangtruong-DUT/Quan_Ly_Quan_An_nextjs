"use client";
import menuItems from "@/app/[locale]/manage/_components/menuItems";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/providers/app-provider";
import { Package2, Settings } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export default function NavLinks() {
    const t = useTranslations("ManageNavigation");
    const pathname = usePathname();
    const role = useAppStore((state) => state.role);

    return (
        <TooltipProvider>
            <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
                <nav className="flex flex-col items-center gap-4 px-2 py-4">
                    <Link
                        href="#"
                        className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
                    >
                        <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                        <span className="sr-only">Acme Inc</span>
                    </Link>

                    {menuItems.map((Item, index) => {
                        const isActive = pathname === Item.href;
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        if (Item.role && !Item.role.includes(role as any)) return null;

                        return (
                            <Tooltip key={index}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={Item.href}
                                        className={cn(
                                            "flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8",
                                            {
                                                "bg-accent text-accent-foreground": isActive,
                                                "text-muted-foreground": !isActive,
                                            }
                                        )}
                                    >
                                        <Item.Icon className="h-5 w-5" />
                                        <span className="sr-only">
                                            {t(Item.title as "dashboard" | "orders" | "tables" | "dishes" | "accounts")}
                                        </span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    {t(Item.title as "dashboard" | "orders" | "tables" | "dishes" | "accounts")}
                                </TooltipContent>
                            </Tooltip>
                        );
                    })}
                </nav>
                <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-4">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Link
                                href="/manage/setting"
                                className={cn(
                                    "flex h-9 w-9 items-center justify-center rounded-lg  transition-colors hover:text-foreground md:h-8 md:w-8",
                                    {
                                        "bg-accent text-accent-foreground": pathname === "/manage/setting",
                                        "text-muted-foreground": pathname !== "/manage/setting",
                                    }
                                )}
                            >
                                <Settings className="h-5 w-5" />
                                <span className="sr-only">{t("settings")}</span>
                            </Link>
                        </TooltipTrigger>
                        <TooltipContent side="right">{t("settings")}</TooltipContent>
                    </Tooltip>
                </nav>
            </aside>
        </TooltipProvider>
    );
}
