"use client";

import { TableListResType } from "@/utils/validation/table.schema";
import { createContext, useContext, useState } from "react";

export type TableItem = TableListResType["data"][0];

type TableContextProps = {
    setTableIdEdit: (value: number | undefined) => void;
    tableIdEdit: number | undefined;
    tableDelete: TableItem | null;
    setTableDelete: (value: TableItem | null) => void;
};

const TableTableContext = createContext<TableContextProps>({
    setTableIdEdit: () => {},
    tableIdEdit: undefined,
    tableDelete: null,
    setTableDelete: () => {},
});

export const useTableTableContext = () => {
    return useContext(TableTableContext);
};

export default function TableTableProvider({ children }: { children: React.ReactNode }) {
    const [tableIdEdit, setTableIdEdit] = useState<number | undefined>();
    const [tableDelete, setTableDelete] = useState<TableItem | null>(null);
    return (
        <TableTableContext value={{ tableDelete, setTableDelete, tableIdEdit, setTableIdEdit }}>
            {children}
        </TableTableContext>
    );
}
