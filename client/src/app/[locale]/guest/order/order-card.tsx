"use client";

import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/constants/type";
import { useGuestGetOrderListQuery } from "@/hooks/data/useGuest";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import Image from "next/image";
import { useTranslations } from "next-intl";
export default function OrderCard() {
    const t = useTranslations("OrderPage");
    const tStatus = useTranslations("OrderStatus");
    const { data } = useGuestGetOrderListQuery();
    const orders = data?.payload.data || [];

    if (orders.length === 0) {
        return <p className="text-center text-gray-500">{t("noOrders")}</p>;
    }

    const unpaidAmount = orders.reduce((total, order) => {
        if (order.status === OrderStatus.Paid || order.status === OrderStatus.Rejected) return total;
        return total + (order.dishSnapshot.price || 0) * order.quantity;
    }, 0);

    const paidAmount = orders.reduce((total, order) => {
        if (order.status === OrderStatus.Paid) {
            return total + (order.dishSnapshot.price || 0) * order.quantity;
        }
        return total;
    }, 0);

    const totalQuantity = orders.reduce((total, order) => total + order.quantity, 0);

    return (
        <>
            {orders.map((order, index) => {
                return (
                    <div
                        key={order.id}
                        className={cn("flex gap-4  border-gray-200 py-2", {
                            "border-b": index < orders.length - 1,
                        })}
                    >
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
                            <Badge variant={"outline"}>{tStatus(order.status)}</Badge>
                        </div>
                    </div>
                );
            })}

            <div className="sticky bottom-0 border-t bg-background border-gray-300 p-4">
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">{t("unpaid")}</span>
                    <span className="text-red-600 font-semibold">{formatCurrency(unpaidAmount)}</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span className="font-semibold">{t("paid")}</span>
                    <span className="text-green-600 font-semibold">{formatCurrency(paidAmount)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="font-semibold">{t("totalItems")}</span>
                    <span>{totalQuantity}</span>
                </div>
            </div>
        </>
    );
}
