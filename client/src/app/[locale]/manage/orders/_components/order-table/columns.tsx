/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

import { OrderStatusValues } from "@/constants/type";
import { simpleMatchText } from "@/utils/common";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import { formatDateTimeToLocaleString } from "@/utils/formatting/formatTime";
import { useOrderStatus } from "@/helpers/common";
import { OrderStatusType } from "@/types/order";
import OrderGuestDetail from "@/app/[locale]/manage/orders/_components/order-guest-detail";
import { useOrderTableContext } from "@/app/[locale]/manage/orders/context/order-table-provider";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

const TableNumberCell = ({ value }: { value: number }) => <div>{value}</div>;

const GuestCell = ({ row }: { row: Row<any> }) => {
    const t = useTranslations("OrderColumns");
    const { orderObjectByGuestId } = useOrderTableContext();
    const guest = row.original.guest;

    if (!guest)
        return (
            <div>
                <span>{t("guestDeleted")}</span>
            </div>
        );

    return (
        <Popover>
            <PopoverTrigger>
                <div>
                    <span>{guest.name}</span>
                    <span className="font-semibold">(#{guest.id})</span>
                </div>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] sm:w-[440px]">
                <OrderGuestDetail guest={guest} orders={orderObjectByGuestId[guest.id]} />
            </PopoverContent>
        </Popover>
    );
};

const DishCell = ({ row }: { row: Row<any> }) => {
    const dish = row.original.dishSnapshot;
    const quantity = row.original.quantity;

    return (
        <div className="flex items-center gap-2">
            <Popover>
                <PopoverTrigger asChild>
                    <Image
                        src={dish.image}
                        alt={dish.name}
                        width={50}
                        height={50}
                        className="rounded-md object-cover w-[50px] h-[50px] cursor-pointer"
                    />
                </PopoverTrigger>
                <PopoverContent>
                    <div className="flex flex-wrap gap-2">
                        <Image
                            src={dish.image}
                            alt={dish.name}
                            width={100}
                            height={100}
                            className="rounded-md object-cover w-[100px] h-[100px]"
                        />
                        <div className="space-y-1 text-sm">
                            <h3 className="font-semibold">{dish.name}</h3>
                            <div className="italic">{formatCurrency(dish.price)}</div>
                            <div>{dish.description}</div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span>{dish.name}</span>
                    <Badge className="px-1" variant="secondary">
                        x{quantity}
                    </Badge>
                </div>
                <span className="italic">{formatCurrency(dish.price * quantity)}</span>
            </div>
        </div>
    );
};

const StatusCell = ({ row }: { row: Row<any> }) => {
    const { changeStatus } = useOrderTableContext();
    const t = useTranslations("OrderColumns");
    const getOrderStatus = useOrderStatus();

    const handleChange = async (status: OrderStatusType) => {
        changeStatus({
            orderId: row.original.id,
            dishId: row.original.dishSnapshot.dishId!,
            status,
            quantity: row.original.quantity,
        });
    };

    return (
        <Select value={row.getValue("status")} onValueChange={handleChange}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder={t("selectStatus")} />
            </SelectTrigger>
            <SelectContent>
                {OrderStatusValues.map((status) => (
                    <SelectItem key={status} value={status}>
                        {getOrderStatus(status)}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

const ActionsCell = ({ row }: { row: any }) => {
    const t = useTranslations("OrderColumns");
    const { setOrderIdEdit } = useOrderTableContext();

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <DotsHorizontalIcon className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t("actions")}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOrderIdEdit(row.original.id)}>{t("edit")}</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export function useOrderColumns() {
    const t = useTranslations("OrderColumns");

    return useMemo(
        () => [
            {
                accessorKey: "tableNumber",
                header: t("tableNumber"),
                cell: ({ row }: { row: Row<any> }) => <TableNumberCell value={row.getValue("tableNumber")} />,
                filterFn: (row: any, columnId: any, filterValue: string) =>
                    simpleMatchText(String(row.getValue(columnId)), String(filterValue)),
            },
            {
                id: "guestName",
                header: t("guest"),
                cell: ({ row }: { row: Row<any> }) => <GuestCell row={row} />,
                filterFn: (row: any, _columnId: any, filterValue: string) =>
                    simpleMatchText(row.original.guest?.name ?? t("guestDeleted"), filterValue),
            },
            {
                id: "dishName",
                header: t("orders"),
                cell: ({ row }: { row: Row<any> }) => <DishCell row={row} />,
            },
            {
                accessorKey: "status",
                header: t("status"),
                cell: ({ row }: { row: Row<any> }) => <StatusCell row={row} />,
            },
            {
                id: "orderHandlerName",
                header: t("orderHandler"),
                cell: ({ row }: { row: Row<any> }) => <div>{row.original.orderHandler?.name ?? ""}</div>,
            },
            {
                accessorKey: "createdAt",
                header: t("createdAt"),
                cell: ({ row }: { row: Row<any> }) => (
                    <div className="space-y-2 text-sm">
                        <div>{formatDateTimeToLocaleString(row.getValue("createdAt"))}</div>
                        <div>{formatDateTimeToLocaleString(row.original.updatedAt)}</div>
                    </div>
                ),
            },
            {
                id: "actions",
                enableHiding: false,
                cell: ({ row }: { row: Row<any> }) => <ActionsCell row={row} />,
            },
        ],
        [t]
    );
}
