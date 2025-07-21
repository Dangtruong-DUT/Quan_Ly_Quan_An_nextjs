"use client";

import { useLogoutMutation } from "@/hooks/data/useAuth";
import { useAppStore } from "@/providers/app-provider";
import { clientSessionToken } from "@/services/storage/clientSessionToken";
import { handleErrorApi } from "@/utils/handleError";
import { use, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { LoaderPinwheel } from "lucide-react";

export default function LogoutPage({
    searchParams,
}: {
    searchParams: Promise<{ accessToken?: string; refreshToken?: string }>;
}) {
    const router = useRouter();
    const setRole = useAppStore((state) => state.setRole);
    const { accessToken, refreshToken } = use(searchParams);
    const { mutateAsync: logoutMutate } = useLogoutMutation();
    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logoutMutate();
            } catch (error) {
                handleErrorApi(error);
            } finally {
                setRole(undefined);
                router.push("/");
            }
        };
        if (
            (accessToken && clientSessionToken.accessToken === accessToken) ||
            (refreshToken && clientSessionToken.refreshToken === refreshToken)
        ) {
            handleLogout();
        } else {
            router.push("/");
        }
    }, [logoutMutate, accessToken, refreshToken, router, setRole]);
    return (
        <div className="flex flex-col gap-3 items-center justify-center">
            <h1 className="text-2xl text-center font-bold pt-50">Redirecting...</h1>
            <LoaderPinwheel className="animate-spin w-5 h-5" />
        </div>
    );
}
