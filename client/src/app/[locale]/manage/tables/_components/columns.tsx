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
import { useTableStatus } from "@/helpers/common";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function useTableColumns(): ColumnDef<TableItem>[] {
    const t = useTranslations("TableColumns");
    const getTableStatus = useTableStatus();

    return useMemo<ColumnDef<TableItem>[]>(
        () => [
            {
                accessorKey: "number",
                header: t("tableNumber"),
                cell: ({ row }) => <div className="capitalize">{row.getValue("number")}</div>,
                filterFn: (rows, columnsId, filterValue) => {
                    if (!filterValue) return true;
                    return String(rows.getValue(columnsId)) === filterValue;
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
            {
                accessorKey: "token",
                header: t("qrCode"),
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t("openMenu")}</span>
                                    <DotsHorizontalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={openEditTable}>{t("edit")}</DropdownMenuItem>
                                <DropdownMenuItem onClick={openDeleteTable} className="text-red-500">
                                    {t("delete")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [getTableStatus, t]
    );
}
