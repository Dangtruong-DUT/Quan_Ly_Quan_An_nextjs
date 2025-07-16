"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createContext, use, useCallback, useEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RefreshToken } from "@/components/refresh-token";
import { clientSessionToken } from "@/service/storage/clientSessionToken";
import { RoleType, TokenPayload } from "@/types/jwt";
import { decodeJwt } from "@/utils/jwt";

type AppContextType = {
    role: RoleType | undefined;
    setRole: (role: RoleType | undefined) => void;
    isAuth: boolean;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const AppContext = createContext<AppContextType>({ role: undefined, setRole: () => {}, isAuth: false });

export function useAppContext() {
    return use(AppContext);
}

export default function AppProvider({ children }: { children: ReactNode }) {
    const [role, setRole] = useState<RoleType | undefined>(undefined);

    useEffect(() => {
        if (clientSessionToken.refreshToken == null) return;
        const { role } = decodeJwt<TokenPayload>(clientSessionToken.refreshToken);
        setRole(role);
    }, []);
    const handleSetRole = useCallback(
        (value: RoleType | undefined) => {
            setRole(value);
            if (value === undefined) {
                clientSessionToken.clear();
            }
        },
        [setRole]
    );

    const isAuth = Boolean(role);

    return (
        <AppContext value={{ role, setRole: handleSetRole, isAuth }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <RefreshToken />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AppContext>
    );
}
