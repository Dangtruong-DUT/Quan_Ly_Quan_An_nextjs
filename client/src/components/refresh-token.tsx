"use client";

import { handleRefreshToken } from "@/helpers/auth";
import { useSocketClient } from "@/hooks/shared/useSocketClient";
import { useAppStore } from "@/providers/app-provider";
import { TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";
import { useCallback, useEffect, useRef } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";

const EXCLUDE_PATHS = ["/login", "/register", "/logout", "/refresh-token"];

// Define the interval for refreshing the token
// This is set to  5 minutes (5 * 50 * 1000 milliseconds)
const TIMEOUT_REFRESH_TOKEN = 5 * 60 * 1000;
export function RefreshToken() {
    const router = useRouter();
    const pathname = usePathname();
    const setRole = useAppStore((state) => state.setRole);
    const { socket } = useSocketClient();

    const interValIdRef = useRef<NodeJS.Timeout | null>(null);

    const refreshToken = useCallback(
        (params?: { force?: boolean }) => {
            handleRefreshToken({
                onSuccess: (data) => {
                    const { refreshToken } = data.data;
                    const { role } = decodeJwt<TokenPayload>(refreshToken);
                    setRole(role);
                },
                onError: (error) => {
                    console.error("Error during token refresh:", error);
                    if (interValIdRef.current) {
                        clearInterval(interValIdRef.current);
                        interValIdRef.current = null;
                    }
                },
                onRefreshTokenExpired: () => {
                    router.push("/login");
                    setRole(undefined);
                    if (interValIdRef.current) {
                        clearInterval(interValIdRef.current);
                        interValIdRef.current = null;
                    }
                },
                force: Boolean(params?.force),
            });
        },
        [interValIdRef, router, setRole]
    );
    useEffect(() => {
        function onRefreshToken() {
            console.log("Refresh token event received");
            refreshToken({ force: true });
        }
        socket?.on("refresh-token", onRefreshToken);

        // If the pathname is not in the excluded paths, skip the refresh token logic
        // Skip refresh token logic for excluded paths
        if (EXCLUDE_PATHS.some((path) => pathname.startsWith(path))) return;

        refreshToken();
        interValIdRef.current = setInterval(() => {
            refreshToken();
        }, TIMEOUT_REFRESH_TOKEN);

        return () => {
            socket?.off("refresh-token", onRefreshToken);
            if (interValIdRef.current) {
                clearInterval(interValIdRef.current);
                interValIdRef.current = null;
            }
        };
    }, [interValIdRef, refreshToken, pathname, socket]);

    return null;
}
