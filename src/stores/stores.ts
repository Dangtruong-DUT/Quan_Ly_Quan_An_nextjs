import { RoleType } from "@/types/jwt";
import { createStore } from "zustand/vanilla";

export type AppState = {
    role: RoleType | undefined;
    isAuth: boolean;
};

export type AppAction = {
    setRole: (role: RoleType | undefined) => void;
};

export type AppStore = AppState & AppAction;

export const defaultInitialState: AppState = {
    role: undefined,
    isAuth: false,
};

export const createAppStore = (initialState: AppState = defaultInitialState) => {
    return createStore<AppStore>()((set) => ({
        ...initialState,
        setRole: (role: RoleType | undefined) => {
            set((state) => ({
                ...state,
                role,
                isAuth: role !== undefined,
            }));
        },
    }));
};
