"use client";

import { useAppContext } from "@/app/app-provider";
import { useLogoutMutation } from "@/app/queries/useAuth";
import { clientSessionToken } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function LogoutPage({
    searchParams,
}: {
    searchParams: Promise<{ accessToken?: string; refreshToken?: string }>;
}) {
    const router = useRouter();
    const { setIsAuthenticated } = useAppContext();
    const { accessToken, refreshToken } = use(searchParams);
    const { mutateAsync: logoutMutate } = useLogoutMutation();
    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logoutMutate();
                setIsAuthenticated(false);
            } catch (error) {
                handleErrorApi(error);
            } finally {
                router.refresh();
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
    }, [logoutMutate, accessToken, refreshToken, router, setIsAuthenticated]);
    return <div></div>;
}
