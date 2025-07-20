"use client";

import GuestConfirmLogout from "@/app/[locale]/(public)/alert-diaglog-guest-logout";
import { Role } from "@/constants/type";
import { useAppStore } from "@/providers/app-provider";
import { RoleType } from "@/types/jwt";
import { Link, usePathname } from "@/i18n/navigation";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

export type MenuItemType = {
    title: string;
    href: string;
    hideWhenLogin?: boolean;
    hideWhenLogout?: boolean;
    role?: RoleType[];
    translationKey: string;
};

export default function NavItems({ className }: { className?: string }) {
    const tNavigation = useTranslations("Navigation");

    const menuItems: MenuItemType[] = [
        { title: tNavigation("home"), href: "/", translationKey: "home" },
        { title: tNavigation("menu"), href: "/guest/menu", role: [Role.Guest], translationKey: "menu" },
        { title: tNavigation("orders"), href: "/guest/order", role: [Role.Guest], translationKey: "orders" },
        { title: tNavigation("login"), href: "/login", hideWhenLogin: true, translationKey: "login" },
        {
            title: tNavigation("manage"),
            href: "/manage/dashboard",
            role: [Role.Owner, Role.Employee],
            translationKey: "manage",
        },
    ];
    const { isAuth, role } = useAppStore(
        useShallow((state) => ({
            isAuth: state.isAuth,
            role: state.role,
        }))
    );
    const pathname = usePathname();
    return (
        <>
            {menuItems.map((item) => {
                if (item.hideWhenLogin && isAuth) return null;

                if (item.hideWhenLogout && !isAuth) return null;

                if (item.role) {
                    if (!isAuth) return null;
                    if (!role || !item.role.includes(role)) return null;
                }

                const isActive = pathname === item.href;

                return (
                    <Link href={item.href} key={item.href} className={cn(className, { "text-foreground": isActive })}>
                        {item.title}
                    </Link>
                );
            })}
            {role == Role.Guest && <GuestConfirmLogout className={className} />}
        </>
    );
}
