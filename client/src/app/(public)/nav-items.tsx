"use client";

import GuestConfirmLogout from "@/app/(public)/alert-diaglog-guest-logout";
import { Role } from "@/constants/type";
import { useAppStore } from "@/providers/app-provider";
import { RoleType } from "@/types/jwt";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";

export type MenuItemType = {
    title: string;
    href: string;
    hideWhenLogin?: boolean;
    hideWhenLogout?: boolean;
    role?: RoleType[];
};

const menuItems: MenuItemType[] = [
    { title: "Trang chủ", href: "/" },
    { title: "Menu", href: "/guest/menu", role: [Role.Guest] },
    { title: "Đơn hàng", href: "/guest/order", role: [Role.Guest] },
    { title: "Đăng nhập", href: "/login", hideWhenLogin: true },
    { title: "Quản lý", href: "/manage/dashboard", role: [Role.Owner, Role.Employee] },
];

export default function NavItems({ className }: { className?: string }) {
    const { isAuth, role } = useAppStore(
        useShallow((state) => ({
            isAuth: state.isAuth,
            role: state.role,
        }))
    );
    return (
        <>
            {menuItems.map((item) => {
                if (item.hideWhenLogin && isAuth) return null;

                if (item.hideWhenLogout && !isAuth) return null;

                if (item.role) {
                    if (!isAuth) return null;
                    if (!role || !item.role.includes(role)) return null;
                }

                return (
                    <Link href={item.href} key={item.href} className={className}>
                        {item.title}
                    </Link>
                );
            })}
            {role == Role.Guest && <GuestConfirmLogout className={className} />}
        </>
    );
}
