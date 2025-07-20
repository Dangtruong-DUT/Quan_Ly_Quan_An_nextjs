"use client";

import { useOrderStatus } from "@/helpers/common";
import { useGuestGetOrderListQuery } from "@/hooks/data/useGuest";
import { useSocketClient } from "@/hooks/shared/useSocketClient";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import { PayGuestOrdersResType, UpdateOrderResType } from "@/utils/validation/order.schema";
import { useEffect } from "react";
import { toast } from "sonner";

export function GuestSocket() {
    const getOrderStatus = useOrderStatus();
    const { refetch: refetchOrder } = useGuestGetOrderListQuery();
    const { socket } = useSocketClient();
    useEffect(() => {
        function onOrderUpdate(data: UpdateOrderResType["data"]) {
            toast.message(`Đơn hàng ${data.dishSnapshot.name} đã được cập nhật`, {
                description: `Trạng thái đơn hàng hiện tại: ${getOrderStatus(data.status)}`,
            });
            refetchOrder();
        }

        function onPayment(data: PayGuestOrdersResType["data"]) {
            const { guest } = data[0];
            console.log("Payment data received:", data);
            const total = data.reduce((sum, order) => sum + order.quantity * order.dishSnapshot.price, 0);
            toast.message(`Đã thanh toán thành công  ${data.length} đơn`, {
                description: `Tổng số tiền khách hàng ${guest?.name} thanh toán là ${formatCurrency(total)} VNĐ`,
            });
            refetchOrder();
        }

        socket?.on("update-order", onOrderUpdate);
        socket?.on("payment", onPayment);

        return () => {
            socket?.off("update-order", onOrderUpdate);
            socket?.off("payment", onPayment);
        };
    }, [refetchOrder, socket]);

    return null;
}
