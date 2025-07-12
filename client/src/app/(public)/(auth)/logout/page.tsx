"use client";

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
    const { accessToken, refreshToken } = use(searchParams);
    const { mutateAsync: logoutMutate } = useLogoutMutation();
    const router = useRouter();
    useEffect(() => {
        const handleLogout = async () => {
            try {
                await logoutMutate();
                router.refresh();
                router.push("/");
            } catch (error) {
                handleErrorApi(error);
            }
        };
        if (clientSessionToken.accessToken === accessToken || clientSessionToken.refreshToken === refreshToken) {
            handleLogout();
        }
    }, [logoutMutate, accessToken, refreshToken, router]);
    return <div></div>;
}
