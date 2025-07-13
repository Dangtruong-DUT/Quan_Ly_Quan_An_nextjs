"use client";

import { useContext, useState, createContext } from "react";
import { AccountListResType } from "@/schemaValidations/account.schema";

export type AccountItem = AccountListResType["data"][0];

type AccountTableContextType = {
    setEmployeeIdEdit: (value: number | undefined) => void;
    employeeIdEdit: number | undefined;
    employeeDelete: AccountItem | null;
    setEmployeeDelete: (value: AccountItem | null) => void;
};

const AccountTableContext = createContext<AccountTableContextType>({
    setEmployeeIdEdit: () => {},
    employeeIdEdit: undefined,
    employeeDelete: null,
    setEmployeeDelete: () => {},
});

export function useAccountTableContext() {
    return useContext(AccountTableContext);
}

export default function AccountTableProvider({ children }: { children: React.ReactNode }) {
    const [employeeIdEdit, setEmployeeIdEdit] = useState<number | undefined>();
    const [employeeDelete, setEmployeeDelete] = useState<AccountItem | null>(null);

    return (
        <AccountTableContext value={{ employeeIdEdit, setEmployeeIdEdit, employeeDelete, setEmployeeDelete }}>
            {children}
        </AccountTableContext>
    );
}
