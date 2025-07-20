import { simpleMatchText } from "@/utils/common";
import { TableListResType } from "@/utils/validation/table.schema";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useTableStatus } from "@/helpers/common";

export type TableItem = TableListResType["data"][0];

export function useTablesColumns(): ColumnDef<TableItem>[] {
    const t = useTranslations("TablesDialog");
    const getTableStatus = useTableStatus();

    return [
        {
            accessorKey: "number",
            header: t("tableNumber"),
            cell: ({ row }) => <div className="capitalize">{row.getValue("number")}</div>,
            filterFn: (row, columnId, filterValue: string) => {
                if (filterValue === undefined) return true;
                return simpleMatchText(String(row.original.number), String(filterValue));
            },
        },
        {
            accessorKey: "capacity",
            header: t("capacity"),
            cell: ({ row }) => <div className="capitalize">{row.getValue("capacity")}</div>,
        },
        {
            accessorKey: "status",
            header: t("status"),
            cell: ({ row }) => <div>{getTableStatus(row.getValue("status"))}</div>,
        },
    ];
}
