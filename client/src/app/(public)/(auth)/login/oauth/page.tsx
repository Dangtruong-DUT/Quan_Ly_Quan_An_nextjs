"use client";

import { useSetCookieMutation } from "@/hooks/data/useAuth";
import { useAppStore } from "@/providers/app-provider";
import { TokenPayload } from "@/types/jwt";
import { handleErrorApi } from "@/utils/handleError";
import { decodeJwt } from "@/utils/jwt";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";

export default function OauthPage() {
    const setRole = useAppStore((state) => state.setRole);
    const router = useRouter();

    const { mutateAsync: setCookieMutateAsync } = useSetCookieMutation();

    const searchParams = useSearchParams();
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");
    const message = searchParams.get("message");

    const handleSetCookie = useCallback(
        async (accessToken: string, refreshToken: string) => {
            try {
                await setCookieMutateAsync({
                    accessToken,
                    refreshToken,
                });
                const { role } = decodeJwt<TokenPayload>(accessToken);
                setRole(role);

                router.push("/manage/dashboard");
            } catch (error) {
                handleErrorApi(error);
            }
        },
        [router, setCookieMutateAsync, setRole]
    );

    useEffect(() => {
        if (accessToken && refreshToken) {
            handleSetCookie(accessToken, refreshToken);
        } else {
            setTimeout(() => {
                toast.error(message || "Authentication failed. Please try again.");
            });
            router.push("/login");
        }
    }, [router, message, handleSetCookie, accessToken, refreshToken]);

    return (
        <div className="flex items-center justify-center h-screen">
            <p>Redirecting to OAuth provider...</p>
        </div>
    );
}
