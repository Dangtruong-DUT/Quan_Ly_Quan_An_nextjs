"use client";

import { clientSessionToken } from "@/lib/http";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    const [clientToken] = useState(clientSessionToken);
    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
        setIsAuth(Boolean(clientToken.accessToken));
    }, [clientToken.accessToken]);
    return menuItems.map((item) => {
        if ((item.authRequired === false && isAuth) || (item.authRequired === true && !isAuth)) {
            return null;
        }
        return (
            <Link href={item.href} key={item.href} className={className}>
                {item.title}
            </Link>
        );
    });
}
