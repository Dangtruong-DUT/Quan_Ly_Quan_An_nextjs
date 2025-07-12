"use client";

import { handleRefreshToken } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function RefreshTokenPage({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string; refreshToken?: string }>;
}) {
    const { redirect, refreshToken } = use(searchParams);
    const router = useRouter();
    useEffect(() => {
        if (redirect && refreshToken) {
            handleRefreshToken({
                onSuccess: () => {
                    router.push(redirect);
                },
                onError: (error) => {
                    router.push("/login");
                    console.error("Error during token refresh:", error);
                },
            });
        } else {
            router.push("/");
        }
    });
    return <></>;
}
