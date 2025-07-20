"use client";
import { useAccountTableContext } from "@/app/[locale]/manage/accounts/context/account-table-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AccountType } from "@/utils/validation/account.schema";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function useAccountColumns(): ColumnDef<AccountType>[] {
    const t = useTranslations("AccountColumns");

    return useMemo(
        () => [
            {
                accessorKey: "id",
                header: t("id"),
            },
            {
                accessorKey: "avatar",
                header: t("avatar"),
                cell: ({ row }) => (
                    <div>
                        <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                            <AvatarImage src={row.getValue("avatar")} />
                            <AvatarFallback className="rounded-none">{row.original.name}</AvatarFallback>
                        </Avatar>
                    </div>
                ),
            },
            {
                accessorKey: "name",
                header: t("fullName"),
                cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
            },
            {
                accessorKey: "email",
                header: ({ column }) => {
                    return (
                        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                            {t("email")}
                            <CaretSortIcon className="ml-2 h-4 w-4" />
                        </Button>
                    );
                },
                cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
            },
            {
                accessorKey: "role",
                header: t("role"),
                cell: ({ row }) => <div className="lowercase">{row.getValue("role")}</div>,
            },
            {
                id: "actions",
                enableHiding: false,
                cell: function Actions({ row }) {
                    const { setEmployeeIdEdit, setEmployeeDelete } = useAccountTableContext();
                    const openEditEmployee = () => {
                        setEmployeeIdEdit(row.original.id);
                    };

                    const openDeleteEmployee = () => {
                        setEmployeeDelete(row.original);
                    };
                    return (
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                    <span className="sr-only">{t("openMenu")}</span>
                                    <DotsHorizontalIcon className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={openEditEmployee}>{t("edit")}</DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={openDeleteEmployee}
                                    className="text-red-500
                            "
                                >
                                    {t("delete")}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    );
                },
            },
        ],
        [t]
    );
}

// For backward compatibility, export as default
export default function useColumns() {
    return useAccountColumns();
}
