import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/constants/type";
import { getVietnameseOrderStatus, OrderStatusIcon } from "@/helpers/common";
import { usePayForGuestOrdersMutation } from "@/hooks/data/useOrder";
import { OrderStatusType } from "@/types/order";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import { formatDateTimeToLocaleString, formatDateTimeToTimeString } from "@/utils/formatting/formatTime";
import { handleErrorApi } from "@/utils/handleError";
import { GetOrdersResType } from "@/utils/validation/order.schema";
import Image from "next/image";
import { Fragment, useCallback, useMemo } from "react";

interface OrderGuestDetailProps {
    guest: GetOrdersResType["data"][0]["guest"];
    orders: GetOrdersResType["data"];
}

export default function OrderGuestDetail({ guest, orders }: OrderGuestDetailProps) {
    const { mutateAsync: payMutation, isPending } = usePayForGuestOrdersMutation();

    const handlePayAllOrders = useCallback(async () => {
        if (!guest || isPending) return;
        try {
            await payMutation({ guestId: guest.id });
        } catch (error) {
            handleErrorApi(error);
        }
    }, [guest, payMutation, isPending]);

    const [paidOrders, unpaidOrders] = useMemo(() => {
        if (!guest || !orders) return [[], []];

        const unpaid = orders.filter(
            (order) => order.status !== OrderStatus.Paid && order.status !== OrderStatus.Rejected
        );

        const paid = orders.filter((order) => order.status === OrderStatus.Paid);

        return [paid, unpaid];
    }, [guest, orders]);

    const getOrderStatusIcon = useCallback((status: OrderStatusType) => {
        const iconProps = { className: "w-4 h-4" };

        switch (status) {
            case OrderStatus.Pending:
                return <OrderStatusIcon.Pending {...iconProps} />;
            case OrderStatus.Processing:
                return <OrderStatusIcon.Processing {...iconProps} />;
            case OrderStatus.Rejected:
                return <OrderStatusIcon.Rejected className="w-4 h-4 text-red-400" />;
            case OrderStatus.Delivered:
                return <OrderStatusIcon.Delivered {...iconProps} />;
            case OrderStatus.Paid:
                return <OrderStatusIcon.Paid className="w-4 h-4 text-yellow-400" />;
            default:
                return null;
        }
    }, []);

    const calcTotal = useCallback(
        (list: typeof orders) => list.reduce((sum, order) => sum + order.quantity * order.dishSnapshot.price, 0),
        []
    );

    return (
        <div className="space-y-2 text-sm">
            {guest && (
                <Fragment>
                    <div className="space-x-1">
                        <span className="font-semibold">Tên:</span>
                        <span>{guest.name}</span>
                        <span className="font-semibold">(#{guest.id})</span>
                        <span>|</span>
                        <span className="font-semibold">Bàn:</span>
                        <span>{guest.tableNumber}</span>
                    </div>
                    <div className="space-x-1">
                        <span className="font-semibold">Ngày đăng ký:</span>
                        <span>{formatDateTimeToLocaleString(guest.createdAt)}</span>
                    </div>
                </Fragment>
            )}

            <div className="space-y-1">
                <div className="font-semibold">Đơn hàng:</div>
                {orders.map((order, index) => (
                    <div key={order.id} className="flex gap-2 items-center text-xs">
                        <span className="w-[10px]">{index + 1}</span>
                        <span title={getVietnameseOrderStatus(order.status)}>{getOrderStatusIcon(order.status)}</span>
                        <Image
                            src={order.dishSnapshot.image}
                            alt={order.dishSnapshot.name}
                            title={order.dishSnapshot.name}
                            width={30}
                            height={30}
                            className="h-[30px] w-[30px] rounded object-cover"
                        />
                        <span className="truncate w-[70px] sm:w-[100px]" title={order.dishSnapshot.name}>
                            {order.dishSnapshot.name}
                        </span>
                        <span className="font-semibold" title={`Tổng: ${order.quantity}`}>
                            x{order.quantity}
                        </span>
                        <span className="italic">{formatCurrency(order.quantity * order.dishSnapshot.price)}</span>
                        <span
                            className="hidden sm:inline"
                            title={`Tạo: ${formatDateTimeToLocaleString(
                                order.createdAt
                            )} | Cập nhật: ${formatDateTimeToLocaleString(order.updatedAt)}`}
                        >
                            {formatDateTimeToLocaleString(order.createdAt)}
                        </span>
                        <span
                            className="sm:hidden"
                            title={`Tạo: ${formatDateTimeToLocaleString(
                                order.createdAt
                            )} | Cập nhật: ${formatDateTimeToLocaleString(order.updatedAt)}`}
                        >
                            {formatDateTimeToTimeString(order.createdAt)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="space-x-1">
                <span className="font-semibold">Chưa thanh toán:</span>
                <Badge>{formatCurrency(calcTotal(unpaidOrders))}</Badge>
            </div>

            <div className="space-x-1">
                <span className="font-semibold">Đã thanh toán:</span>
                <Badge variant="outline">{formatCurrency(calcTotal(paidOrders))}</Badge>
            </div>

            <div>
                <Button
                    className="w-full"
                    size="sm"
                    variant="secondary"
                    disabled={unpaidOrders.length === 0 || isPending}
                    onClick={handlePayAllOrders}
                >
                    Thanh toán tất cả ({unpaidOrders.length} đơn)
                </Button>
            </div>
        </div>
    );
}
