"use client";

import clientRequestAuthApi from "@/api/clientToServer/auth";
import { handleRefreshToken } from "@/helpers/auth";
import { useAppStore } from "@/providers/app-provider";
import { clientSessionToken } from "@/services/storage/clientSessionToken";
import { TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";
import { use, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";

export default function RefreshTokenPage({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string; refreshToken?: string }>;
}) {
    const { redirect, refreshToken } = use(searchParams);
    const setRole = useAppStore((state) => state.setRole);
    const router = useRouter();
    useEffect(() => {
        if (redirect && clientSessionToken.refreshToken && refreshToken === clientSessionToken.refreshToken) {
            handleRefreshToken({
                onSuccess: (data) => {
                    const { refreshToken: newRefreshToken } = data.data;
                    const { role } = decodeJwt<TokenPayload>(newRefreshToken);
                    setRole(role);
                    router.push(redirect);
                },
                onError: (error) => {
                    setRole(undefined);
                    router.push("/login");
                    console.error("Error during token refresh:", error);
                },
                onRefreshTokenExpired: () => {
                    setRole(undefined);
                    router.push("/login");
                },
            });
        } else {
            clientRequestAuthApi.logout();
            router.push("/login");
        }
    });
    return <></>;
}
