"use client";

import { useLogoutMutation } from "@/app/queries/useAuth";
import { clientSessionToken } from "@/lib/http";
import { handleErrorApi } from "@/lib/utils";
import { use, useEffect } from "react";

export default function LogoutPage({
    searchParams,
}: {
    searchParams: Promise<{ accessToken?: string; refreshToken?: string }>;
}) {
    const { accessToken, refreshToken } = use(searchParams);
    const { mutateAsync: logoutMutate } = useLogoutMutation();
    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logoutMutate();
            } catch (error) {
                handleErrorApi(error);
            }
        };
        if (clientSessionToken.accessToken === accessToken || clientSessionToken.refreshToken === refreshToken) {
            handleLogout();
        }
    }, [logoutMutate, accessToken, refreshToken]);
    return <div>Logout</div>;
}
