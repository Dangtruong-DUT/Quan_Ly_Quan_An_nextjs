"use client";

import clientRequestAuthApi from "@/api/clientToServer/auth";
import { useAppContext } from "@/app/app-provider";
import { handleRefreshToken } from "@/helpers/auth";
import { clientSessionToken } from "@/service/storage/clientSessionToken";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function RefreshTokenPage({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string; refreshToken?: string }>;
}) {
    const { redirect, refreshToken } = use(searchParams);
    const { setIsAuthenticated } = useAppContext();
    const router = useRouter();
    useEffect(() => {
        if (redirect && refreshToken === clientSessionToken.refreshToken) {
            handleRefreshToken({
                onSuccess: () => {
                    router.push(redirect);
                },
                onError: (error) => {
                    setIsAuthenticated(false);
                    router.push("/login");
                    console.error("Error during token refresh:", error);
                },
                onRefreshTokenExpired: () => {
                    setIsAuthenticated(false);
                    router.push("/login");
                },
            });
        } else {
            router.push("/");
            clientRequestAuthApi.logout();
        }
    });
    return <></>;
}
