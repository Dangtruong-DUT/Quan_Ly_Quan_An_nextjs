"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createContext, use, useCallback, useEffect, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RefreshToken } from "@/components/refresh-token";
import { clientSessionToken } from "@/lib/http";

type AppContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: (value: boolean) => void;
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    },
});

const AppContext = createContext<AppContextType>({ isAuthenticated: false, setIsAuthenticated: () => {} });

export function useAppContext() {
    return use(AppContext);
}

export default function AppProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        setIsAuthenticated(Boolean(clientSessionToken.refreshToken));
    }, []);
    const handleSetIsAuthenticated = useCallback(
        (value: boolean) => {
            setIsAuthenticated(value);
            if (!value) {
                clientSessionToken.clear();
            }
        },
        [setIsAuthenticated]
    );
    return (
        <AppContext value={{ setIsAuthenticated: handleSetIsAuthenticated, isAuthenticated }}>
            <QueryClientProvider client={queryClient}>
                {children}
                <RefreshToken />
                <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
        </AppContext>
    );
}
