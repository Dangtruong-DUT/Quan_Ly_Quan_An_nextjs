import Image from "next/image";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import { getVietnameseDishStatus } from "@/helpers/common";
import { simpleMatchText } from "@/utils/common";
import { ColumnDef } from "@tanstack/react-table";
import { DishItem } from "@/app/[locale]/manage/dishes/context/DishTableContext";
import { useTranslations } from "next-intl";

export function useDishesColumns(): ColumnDef<DishItem>[] {
    const t = useTranslations("DishesDialog");

    return [
        {
            id: "dishName",
            header: t("dishName"),
            cell: ({ row }) => (
                <div className="flex items-center space-x-4">
                    <Image
                        src={row.original.image}
                        alt={row.original.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover w-[50px] h-[50px]"
                    />
                    <span>{row.original.name}</span>
                </div>
            ),
            filterFn: (row, columnId, filterValue: string) => {
                if (filterValue === undefined) return true;
                return simpleMatchText(String(row.original.name), String(filterValue));
            },
        },
        {
            accessorKey: "price",
            header: t("price"),
            cell: ({ row }) => <div className="capitalize">{formatCurrency(row.getValue("price"))}</div>,
        },
        {
            accessorKey: "status",
            header: t("status"),
            cell: ({ row }) => <div>{getVietnameseDishStatus(row.getValue("status"))}</div>,
        },
    ];
}
