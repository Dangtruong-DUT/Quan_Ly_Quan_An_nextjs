"use client";

import clientRequestAuthApi from "@/api/clientToServer/auth";
import { handleRefreshToken } from "@/helpers/auth";
import { useAppStore } from "@/providers/app-provider";
import { clientSessionToken } from "@/services/storage/clientSessionToken";
import { TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";
import { LoaderPinwheel } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function RefreshTokenPage({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string; refreshToken?: string }>;
}) {
    const { redirect, refreshToken } = use(searchParams);
    const setRole = useAppStore((state) => state.setRole);
    const router = useRouter();
    useEffect(() => {
        if (clientSessionToken.refreshToken && refreshToken === clientSessionToken.refreshToken) {
            handleRefreshToken({
                onSuccess: (data) => {
                    const { refreshToken: newRefreshToken } = data.data;
                    const { role } = decodeJwt<TokenPayload>(newRefreshToken);
                    setRole(role);
                    if (redirect) {
                        router.push(redirect);
                    } else {
                        router.push("/");
                    }
                },
                onError: (error) => {
                    setRole(undefined);
                    router.push("/");
                    clientRequestAuthApi.logout();
                    console.error("Error during token refresh:", error);
                },
                onRefreshTokenExpired: () => {
                    setRole(undefined);
                    clientRequestAuthApi.logout();
                    router.push("/");
                },
            });
        } else {
            //  router.push("/");
        }
    }, [redirect, refreshToken, setRole, router]);
    return (
        <div className="flex flex-col gap-3 items-center justify-center">
            <h1 className="text-2xl text-center font-bold pt-50">Redirecting...</h1>
            <LoaderPinwheel className="animate-spin w-5 h-5" />
        </div>
    );
}
