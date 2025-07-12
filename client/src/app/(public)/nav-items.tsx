"use client";

import { useAppContext } from "@/app/app-provider";
import Link from "next/link";

const menuItems = [
    {
        title: "Món ăn",
        href: "/menu",
    },
    {
        title: "Đơn hàng",
        href: "/orders", // This item does not require authentication and should be visible to all users
    },
    {
        title: "Đăng nhập",
        href: "/login",
        authRequired: false, // This item does not require authentication and should be visible to unauthenticated users
    },
    {
        title: "Quản lý",
        href: "/manage/dashboard",
        authRequired: true, // This item requires authentication
    },
];

export default function NavItems({ className }: { className?: string }) {
    const { isAuthenticated } = useAppContext();
    return menuItems.map((item) => {
        if ((item.authRequired === false && isAuthenticated) || (item.authRequired === true && !isAuthenticated)) {
            return null;
        }
        return (
            <Link href={item.href} key={item.href} className={className}>
                {item.title}
            </Link>
        );
    });
}
