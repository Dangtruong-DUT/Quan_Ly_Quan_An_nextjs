"use client";

import { useAppContext } from "@/app/app-provider";
import { useLogoutMutation } from "@/hooks/data/useAuth";
import { clientSessionToken } from "@/service/storage/clientSessionToken";
import { handleErrorApi } from "@/utils/handleError";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function LogoutPage({
    searchParams,
}: {
    searchParams: Promise<{ accessToken?: string; refreshToken?: string }>;
}) {
    const router = useRouter();
    const { setRole } = useAppContext();
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
    return <div></div>;
}
