"use client";

import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/constants/type";
import { getVietnameseOrderStatus } from "@/helpers/common";
import { useGuestGetOrderListQuery } from "@/hooks/data/useGuest";
import { useSocketClient } from "@/hooks/shared/useSocketClient";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import { PayGuestOrdersResType, UpdateOrderResType } from "@/utils/validation/order.schema";
import Image from "next/image";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OrderCard() {
    const { data, refetch: refetchOrder } = useGuestGetOrderListQuery();
    const orders = data?.payload.data || [];
    const { socket } = useSocketClient();

    useEffect(() => {
        if (!socket) return;

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
        socket.on("payment", onPayment);

        return () => {
            socket.off("update-order", onOrderUpdate);
            socket.off("payment", onPayment);
        };
    }, [refetchOrder, socket]);

    if (orders.length === 0) {
        return <p className="text-center text-gray-500">Bạn chưa có đơn hàng nào.</p>;
    }

    // Tổng tiền chưa thanh toán (orders status chưa phải Paid hoặc Rejected)
    const unpaidAmount = orders.reduce((total, order) => {
        if (order.status === OrderStatus.Paid || order.status === OrderStatus.Rejected) return total;
        return total + (order.dishSnapshot.price || 0) * order.quantity;
    }, 0);

    // Tổng tiền đã thanh toán (orders đã Paid)
    const paidAmount = orders.reduce((total, order) => {
        if (order.status === OrderStatus.Paid) {
            return total + (order.dishSnapshot.price || 0) * order.quantity;
        }
        return total;
    }, 0);

    // Tổng số món
    const totalQuantity = orders.reduce((total, order) => total + order.quantity, 0);

    return (
        <>
            {orders.map((order, index) => {
                return (
                    <div key={order.id} className="flex gap-4 border-b border-gray-200 py-2">
                        <div className="text-xs">{index + 1}</div>
                        <div className="flex-shrink-0 relative rounded-md overflow-hidden">
                            <Image
                                src={order.dishSnapshot.image}
                                alt={order.dishSnapshot.name}
                                height={100}
                                width={100}
                                quality={100}
                                className="object-cover w-[80px] h-[80px]"
                                onError={(e) => {
                                    e.currentTarget.src = "/placeholderimage.webp";
                                }}
                            />
                        </div>
                        <div className="space-y-1 flex-grow">
                            <h3 className="text-sm font-semibold">{order.dishSnapshot.name}</h3>
                            <p className="text-xs text-gray-600">{order.dishSnapshot.description}</p>
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

            <div className="sticky bottom-0 bg-white border-t border-gray-300 p-4">
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">Chưa thanh toán:</span>
                    <span className="text-red-600 font-semibold">{formatCurrency(unpaidAmount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">Đã thanh toán:</span>
                    <span className="text-green-600 font-semibold">{formatCurrency(paidAmount)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">Tổng số món:</span>
                    <span>{totalQuantity}</span>
                </div>
            </div>
        </>
    );
}
