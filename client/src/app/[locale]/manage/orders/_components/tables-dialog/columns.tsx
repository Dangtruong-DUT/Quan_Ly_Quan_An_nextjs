import { getVietnameseTableStatus } from "@/helpers/common";
import { simpleMatchText } from "@/utils/common";
import { TableListResType } from "@/utils/validation/table.schema";
import { ColumnDef } from "@tanstack/react-table";

export type TableItem = TableListResType["data"][0];

export const columns: ColumnDef<TableItem>[] = [
    {
        accessorKey: "number",
        header: "Số bàn",
        cell: ({ row }) => <div className="capitalize">{row.getValue("number")}</div>,
        filterFn: (row, columnId, filterValue: string) => {
            if (filterValue === undefined) return true;
            return simpleMatchText(String(row.original.number), String(filterValue));
        },
    },
    {
        accessorKey: "capacity",
        header: "Sức chứa",
        cell: ({ row }) => <div className="capitalize">{row.getValue("capacity")}</div>,
    },
    {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <div>{getVietnameseTableStatus(row.getValue("status"))}</div>,
    },
];

export default columns;
