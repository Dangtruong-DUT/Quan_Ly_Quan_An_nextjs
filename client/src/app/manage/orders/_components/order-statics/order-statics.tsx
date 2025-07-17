"use client";

import { Fragment, useCallback, useMemo, useState } from "react";
import { Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { cn } from "@/lib/utils";
import { getVietnameseOrderStatus, OrderStatusIcon } from "@/helpers/common";

import OrderGuestDetail from "@/app/manage/orders/_components/order-guest-detail";
import { ServingGuestByTableNumber, Statics, StatusCountObject } from "@/app/manage/orders/_components/order.service";

import { TableListResType } from "@/utils/validation/table.schema";
import { OrderStatusValues } from "@/constants/type";
import { OrderStatusType } from "@/types/order";

export default function OrderStatics({
    statics,
    tableList,
    servingGuestByTableNumber,
}: {
    statics: Statics;
    tableList: TableListResType["data"];
    servingGuestByTableNumber: ServingGuestByTableNumber;
}) {
    const [selectedTable, setSelectedTable] = useState<number>(-1);

    const handleCloseDialog = useCallback(() => setSelectedTable(-1), []);

    const guestsAtTable = useMemo(() => {
        return servingGuestByTableNumber[selectedTable];
    }, [selectedTable, servingGuestByTableNumber]);

    const calculateOrderCount = useCallback((tableStatics?: Record<number, StatusCountObject>) => {
        const count: StatusCountObject = {
            Pending: 0,
            Processing: 0,
            Delivered: 0,
            Paid: 0,
            Rejected: 0,
        };

        let isEmpty = true;

        if (!tableStatics) return { isEmpty, count };

        for (const guestStats of Object.values(tableStatics)) {
            if (guestStats.Pending || guestStats.Processing || guestStats.Delivered) {
                isEmpty = false;
            }

            (Object.keys(count) as (keyof StatusCountObject)[]).forEach((status) => {
                count[status] += guestStats[status] ?? 0;
            });
        }

        return { isEmpty, count };
    }, []);

    const StatusIconWithTooltip = useCallback(({ status, count }: { status: OrderStatusType; count: number }) => {
        const Icon = OrderStatusIcon[status];
        if (!Icon) return null;

        return (
            <Tooltip>
                <TooltipTrigger>
                    <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{count}</span>
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    {getVietnameseOrderStatus(status)}: {count} đơn
                </TooltipContent>
            </Tooltip>
        );
    }, []);

    return (
        <Fragment>
            {/* Dialog hiển thị chi tiết khách */}
            <Dialog open={!!selectedTable && !!guestsAtTable} onOpenChange={(open) => !open && handleCloseDialog()}>
                <DialogContent className="max-h-full overflow-auto">
                    {guestsAtTable && (
                        <>
                            <DialogHeader>
                                <DialogTitle>Khách đang ngồi tại bàn {selectedTable}</DialogTitle>
                            </DialogHeader>
                            {Object.entries(guestsAtTable).map(([guestId, orders], index, array) => (
                                <div key={guestId}>
                                    <OrderGuestDetail guest={orders[0].guest} orders={orders} />
                                    {index < array.length - 1 && <Separator className="my-5" />}
                                </div>
                            ))}
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Danh sách bàn */}
            <div className="flex flex-wrap gap-4 py-4 items-stretch justify-start">
                {tableList.map((table) => {
                    const tableNumber = table.number;
                    const tableStats = statics.table[tableNumber];
                    const { isEmpty, count } = calculateOrderCount(tableStats);
                    const guestCount = Object.keys(servingGuestByTableNumber[tableNumber] || {}).length;

                    return (
                        <div
                            key={tableNumber}
                            className={cn("text-sm flex items-stretch gap-2 border p-2 rounded-md", {
                                "bg-secondary border-transparent": !isEmpty,
                                "cursor-pointer": !isEmpty,
                            })}
                            onClick={() => !isEmpty && setSelectedTable(tableNumber)}
                        >
                            <div className="flex flex-col items-center justify-center gap-2">
                                <div className="font-semibold text-center text-lg">{tableNumber}</div>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger>
                                            <div className="flex items-center gap-2">
                                                <Users className="h-4 w-4" />
                                                <span>{guestCount}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>Đang phục vụ: {guestCount} khách</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>

                            <Separator
                                orientation="vertical"
                                className={cn("flex-shrink-0 h-auto", {
                                    "bg-muted-foreground": !isEmpty,
                                })}
                            />

                            <div className="flex flex-col justify-center">
                                {isEmpty ? (
                                    <span className="text-sm">Ready</span>
                                ) : (
                                    <TooltipProvider>
                                        {(["Pending", "Processing", "Delivered"] as OrderStatusType[]).map((status) => (
                                            <StatusIconWithTooltip key={status} status={status} count={count[status]} />
                                        ))}
                                    </TooltipProvider>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Tổng số đơn theo trạng thái */}
            <div className="flex flex-wrap gap-4 py-4 items-end justify-start">
                {OrderStatusValues.map((status) => (
                    <Badge key={status} variant="secondary">
                        {getVietnameseOrderStatus(status)}: {statics.status[status] ?? 0}
                    </Badge>
                ))}
            </div>
        </Fragment>
    );
}
