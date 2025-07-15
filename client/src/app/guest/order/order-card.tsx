"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getVietnameseOrderStatus } from "@/helpers/common";
import { useGuestGetOrderListQuery } from "@/hooks/data/useGuest";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import Image from "next/image";

export default function OrderCard() {
    const { data } = useGuestGetOrderListQuery();
    const orders = data?.payload.data || [];
    if (orders.length === 0) {
        return <p className="text-center text-gray-500">Bạn chưa có đơn hàng nào.</p>;
    }

    const totalPrice = orders.reduce((total, order) => {
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
