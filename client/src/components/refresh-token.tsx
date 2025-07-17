"use client";

import { useAppContext } from "@/app/app-provider";
import { handleRefreshToken } from "@/helpers/auth";
import socket from "@/service/socket/socket";
import { TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

const EXCLUDE_PATHS = ["/login", "/register", "/logout", "/refresh-token"];
// Define the interval for refreshing the token
// This is set to  5 minutes (5 * 50 * 1000 milliseconds)
const TIMEOUT_REFRESH_TOKEN = 5 * 60 * 1000;
export function RefreshToken() {
    const router = useRouter();
    const pathname = usePathname();
    const { setRole } = useAppContext();
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
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            console.log(socket.id, "Connected to socket server");
        }

        function onDisconnect() {
            console.log("Disconnected from socket server");
        }
        function onRefreshToken() {
            refreshToken({ force: true });
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        // Listen for the refresh token event from the server
        socket.on("refresh-token", onRefreshToken);

        // If the pathname is not in the excluded paths, skip the refresh token logic
        // Skip refresh token logic for excluded paths
        if (EXCLUDE_PATHS.some((path) => pathname.startsWith(path))) return;

        refreshToken();
        interValIdRef.current = setInterval(() => {
            refreshToken();
        }, TIMEOUT_REFRESH_TOKEN);
        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            if (interValIdRef.current) {
                clearInterval(interValIdRef.current);
                interValIdRef.current = null;
            }
        };
    }, [interValIdRef, refreshToken, pathname]);

    return null;
}
