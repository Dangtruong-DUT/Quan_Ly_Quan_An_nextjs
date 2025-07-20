"use client";

import { GuestCreateOrdersResType } from "@/utils/validation/guest.schema";
import { toast } from "sonner";
import { PayGuestOrdersResType, UpdateOrderResType } from "@/utils/validation/order.schema";
import { useSocketClient } from "@/hooks/shared/useSocketClient";
import { useEffect } from "react";
import { useOrderStatus } from "@/helpers/common";
import { useQueryClient } from "@tanstack/react-query";
import { formatCurrency } from "@/utils/formatting/formatCurrency";

export default function ManageSocket() {
    const getOrderStatus = useOrderStatus();
    const queryClient = useQueryClient();
    const { socket } = useSocketClient();
    useEffect(() => {
        function onNewOrder(data: GuestCreateOrdersResType["data"]) {
            const { guest } = data[0];
            toast.message("Đơn hàng mới", {
                description: `Khách hàng ${guest?.name} tại bàn ${guest?.tableNumber} vừa đặt ${data.length} món.`,
            });
            console.log("New order received:", data);
            refetchOrder();
        }

        function onOrderUpdate(data: UpdateOrderResType["data"]) {
            toast.message(`Đơn hàng ${data.dishSnapshot.name} đã được cập nhật`, {
                description: `Trạng thái đơn hàng hiện tại: ${getOrderStatus(data.status)}`,
            });
            refetchOrder();
        }
        function onPayment(data: PayGuestOrdersResType["data"]) {
            const { guest } = data[0];
            const total = data.reduce((sum, order) => sum + order.quantity * order.dishSnapshot.price, 0);
            toast.message(`Đã thanh toán thành công ${data.length} đơn`, {
                description: `Tổng số tiền khách hàng ${guest?.name} thanh toán là ${formatCurrency(total)} VNĐ`,
            });
            refetchOrder();
        }

        function refetchOrder() {
            queryClient.invalidateQueries({ queryKey: ["orderList"] });
        }

        socket?.on("update-order", onOrderUpdate);
        socket?.on("new-order", onNewOrder);
        socket?.on("payment", onPayment);

        return () => {
            socket?.off("new-order", onNewOrder);
            socket?.off("update-order", onOrderUpdate);
            socket?.off("payment", onPayment);
        };
    }, [socket, socket?.id, queryClient]);
    return null;
}
