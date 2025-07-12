"use client";

import { handleRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const EXCLUDE_PATHS = ["/login", "/register", "/logout", "/refresh-token"];
// Define the interval for refreshing the token
// This is set to 1 seconds (1000 milliseconds)
const TIMEOUT_REFRESH_TOKEN = 1000;
export function RefreshToken() {
    const router = useRouter();
    const pathname = usePathname();
    const interValIdRef = useRef<NodeJS.Timeout | null>(null);
    const refreshToken = useCallback(() => {
        handleRefreshToken({
            onError: (error) => {
                console.error("Error during token refresh:", error);
                if (interValIdRef.current) {
                    clearInterval(interValIdRef.current);
                    interValIdRef.current = null;
                }
            },
            onRefreshTokenExpired: () => {
                router.push("/login");
                if (interValIdRef.current) {
                    clearInterval(interValIdRef.current);
                    interValIdRef.current = null;
                }
            },
        });
    }, [interValIdRef, router]);
    useEffect(() => {
        // If the pathname is not in the excluded paths, skip the refresh token logic
        // Skip refresh token logic for excluded paths
        if (EXCLUDE_PATHS.some((path) => pathname.startsWith(path))) return;

        refreshToken();
        interValIdRef.current = setInterval(() => {
            refreshToken();
        }, TIMEOUT_REFRESH_TOKEN);
        return () => {
            if (interValIdRef.current) {
                clearInterval(interValIdRef.current);
                interValIdRef.current = null;
            }
        };
    }, [interValIdRef, refreshToken, pathname]);

    return null;
}
