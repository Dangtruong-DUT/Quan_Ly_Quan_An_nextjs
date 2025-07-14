"use client";

import { useAppContext } from "@/app/app-provider";
import { Role } from "@/constants/type";
import { useGuestLogoutMutation } from "@/hooks/data/useGuest";
import { cn } from "@/lib/utils";
import { RoleType } from "@/types/jwt";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

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
    { title: "Đăng nhập", href: "/login", hideWhenLogin: true },
    { title: "Quản lý", href: "/manage/dashboard", role: [Role.Owner, Role.Employee] },
];

export default function NavItems({ className }: { className?: string }) {
    const { isAuth, role, setRole } = useAppContext();
    const router = useRouter();
    const { mutateAsync: logoutMutate } = useGuestLogoutMutation();

    const handleLogout = useCallback(async () => {
        try {
            await logoutMutate();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setRole(undefined);
            router.refresh();
            router.push("/");
        }
    }, [logoutMutate, router, setRole]);
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
            {role == Role.Guest && (
                <button className={cn(className, "cursor-pointer")} onClick={handleLogout}>
                    Đăng xuất
                </button>
            )}
        </>
    );
}
