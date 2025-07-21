"use client";

import { useSetCookieMutation } from "@/hooks/data/useAuth";
import { useAppStore } from "@/providers/app-provider";
import { TokenPayload } from "@/types/jwt";
import { handleErrorApi } from "@/utils/handleError";
import { decodeJwt } from "@/utils/jwt";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { SearchParamsLoader, useSearchParamsLoader } from "@/components/searchparams-loader";
import { LoaderPinwheel } from "lucide-react";

export default function OauthPage() {
    const t = useTranslations("OauthPage");
    const setRole = useAppStore((state) => state.setRole);
    const router = useRouter();

    const { mutateAsync: setCookieMutateAsync } = useSetCookieMutation();

    const { searchParams, setSearchParams } = useSearchParamsLoader();
    const accessToken = searchParams?.get("accessToken");
    const refreshToken = searchParams?.get("refreshToken");
    const message = searchParams?.get("message");

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
                toast.error(message || t("authenticationFailed"));
            });
            router.push("/login");
        }
    }, [router, message, handleSetCookie, accessToken, refreshToken, t]);

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <SearchParamsLoader onParamsReceived={setSearchParams} />
            <p>{t("redirecting")}</p>
            <h1 className="text-2xl text-center font-bold pt-50">Redirecting...</h1>
            <LoaderPinwheel className="animate-spin w-5 h-5" />
        </div>
    );
}
