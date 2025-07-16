"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatus } from "@/constants/type";
import { getVietnameseOrderStatus } from "@/helpers/common";
import { useGuestGetOrderListQuery } from "@/hooks/data/useGuest";
import socket from "@/service/socket/socket";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import { PayGuestOrdersResType, UpdateOrderResType } from "@/utils/validation/order.schema";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OrderCard() {
    const { data, refetch: refetchOrder } = useGuestGetOrderListQuery();
    const orders = data?.payload.data || [];

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }

        function onConnect() {
            console.log(socket.id, "Connected to socket server");
        }

        function onDisconnect() {
            console.log("Disconnected from socket server");
        }

        function onOrderUpdate(data: UpdateOrderResType["data"]) {
            refetchOrder();
            toast.message(`Đơn hàng ${data.dishSnapshot.name} đã được cập nhật`, {
                description: `Trạng thái đơn hàng hiện tại: ${getVietnameseOrderStatus(data.status)}`,
            });
        }

        function onPayment(data: PayGuestOrdersResType["data"]) {
            refetchOrder();
            const { guest } = data[0];
            const total = data.reduce((sum, order) => sum + order.quantity * order.dishSnapshot.price, 0);
            toast.message(`Đã thanh toán thành công  ${data.length} đơn`, {
                description: `Tổng số tiền khách hàng ${guest?.name} thanh toán là ${total} VNĐ`,
            });
        }

        socket.on("update-order", onOrderUpdate);
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("payment", onPayment);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("update-order", onOrderUpdate);
            socket.off("payment", onPayment);
        };
    }, [refetchOrder]);

    if (orders.length === 0) {
        return <p className="text-center text-gray-500">Bạn chưa có đơn hàng nào.</p>;
    }

    const totalPrice = orders.reduce((total, order) => {
        if (order.status == OrderStatus.Paid || order.status == OrderStatus.Rejected) return total;
        const price = order?.dishSnapshot.price || 0;
        total += price * order.quantity;
        return total;
    }, 0);

    return (
        <>
            {orders.map((order, index) => {
                return (
                    <div key={order.id} className="flex gap-4">
                        <div className="text-xs">{index}</div>
                        <div className="flex-shrink-0 relative  rounded-md overflow-hidden">
                            <Image
                                src={order.dishSnapshot.image}
                                alt={order.dishSnapshot.image}
                                height={100}
                                width={100}
                                quality={100}
                                className="object-cover w-[80px] h-[80px]"
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholderimage.webp";
                                }}
                            />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
                            <p className="text-xs">{order.dishSnapshot.description}</p>
                            <p className="text-xs font-semibold">
                                {formatCurrency(order.dishSnapshot.price)} x <Badge>{order.quantity}</Badge>
                            </p>
                        </div>
                        <div className="ml-auto flex items-center">
                            <Badge variant={"outline"}>{getVietnameseOrderStatus(order.status)}</Badge>
                        </div>
                    </div>
                );
            })}
            <div className="sticky bottom-0">
                <Button className="w-full justify-between">
                    <span>Đơn hàng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>
    );
}
