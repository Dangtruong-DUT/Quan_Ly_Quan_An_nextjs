import { simpleMatchText } from "@/utils/common";
import { formatDateTimeToLocaleString } from "@/utils/formatting/formatTime";
import { GetListGuestsResType } from "@/utils/validation/account.schema";
import { ColumnDef } from "@tanstack/react-table";
import { useTranslations } from "next-intl";

export type GuestItem = GetListGuestsResType["data"][0];

export function useGuestsColumns(): ColumnDef<GuestItem>[] {
    const t = useTranslations("GuestsDialog");

    return [
        {
            accessorKey: "name",
            header: t("guestNameFilter"),
            cell: ({ row }) => (
                <div className="capitalize">
                    {row.getValue("name")} | (#{row.original.id})
                </div>
            ),
            filterFn: (row, columnId, filterValue: string) => {
                if (filterValue === undefined) return true;
                return simpleMatchText(row.original.name + String(row.original.id), String(filterValue));
            },
        },
        {
            accessorKey: "tableNumber",
            header: t("tableNumber"),
            cell: ({ row }) => <div className="capitalize">{row.getValue("tableNumber")}</div>,
            filterFn: (row, columnId, filterValue: string) => {
                if (filterValue === undefined) return true;
                return simpleMatchText(String(row.original.tableNumber), String(filterValue));
            },
        },
        {
            accessorKey: "createdAt",
            header: () => <div>{t("createdAt")}</div>,
            cell: ({ row }) => (
                <div className="flex items-center space-x-4 text-sm">
                    {formatDateTimeToLocaleString(row.getValue("createdAt"))}
                </div>
            ),
        },
    ];
}
