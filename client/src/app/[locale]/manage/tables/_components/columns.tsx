import { TableItem, useTableTableContext } from "@/app/[locale]/manage/tables/context/TableTableContext";
import QRcodeTableGenerate from "@/components/generate-table-qr-code";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getVietnameseTableStatus } from "@/helpers/common";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<TableItem>[] = [
    {
        accessorKey: "number",
        header: "Số bàn",
        cell: ({ row }) => <div className="capitalize">{row.getValue("number")}</div>,
        filterFn: (rows, columnsId, filterValue) => {
            if (!filterValue) return true;
            return String(rows.getValue(columnsId)) === filterValue;
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
    {
        accessorKey: "token",
        header: "QR Code",
        cell: ({ row }) => {
            const { token, number } = row.original;
            return (
                <div>
                    <QRcodeTableGenerate tableNumber={number} token={token} />
                </div>
            );
        },
    },
    {
        id: "actions",
        enableHiding: false,
        cell: function Actions({ row }) {
            const { setTableIdEdit, setTableDelete } = useTableTableContext();
            const openEditTable = () => {
                setTableIdEdit(row.original.number);
            };

            const openDeleteTable = () => {
                setTableDelete(row.original);
            };
            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={openEditTable}>Sửa</DropdownMenuItem>
                        <DropdownMenuItem onClick={openDeleteTable} className="text-red-500">
                            Xóa
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

export default columns;
