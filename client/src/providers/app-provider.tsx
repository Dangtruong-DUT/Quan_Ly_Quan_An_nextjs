"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, createContext, use, useRef } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RefreshToken } from "@/components/refresh-token";
import { SocketListener } from "@/components/socket-listener";
import { AppStore, createAppStore } from "@/stores/stores";
import { useStore } from "zustand";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

export type AppStoreApi = ReturnType<typeof createAppStore>;

const AppContext = createContext<AppStoreApi | undefined>(undefined);

export interface AppProviderProps {
    children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
    const storeRef = useRef<AppStoreApi | null>(null);
    if (storeRef.current === null) {
        storeRef.current = createAppStore();
    }
    return (
        <AppContext value={storeRef.current}>
            <QueryClientProvider client={queryClient}>
                {children}
                <ReactQueryDevtools initialIsOpen={false} />
                <RefreshToken />
                <SocketListener />
            </QueryClientProvider>
        </AppContext>
    );
}

export const useAppStore = <T,>(selector: (store: AppStore) => T): T => {
    const store = use(AppContext);

    if (!store) {
        throw new Error(`useAppStore must be used within AppProvider`);
    }

    return useStore(store, selector);
};
