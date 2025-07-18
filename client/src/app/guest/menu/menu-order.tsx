"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetDishes } from "@/hooks/data/useDishes";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import Quantity from "@/app/guest/menu/quantity";
import { useCallback, useMemo, useState } from "react";
import { GuestCreateOrdersBodyType } from "@/utils/validation/guest.schema";
import { useGuestOrderMutation } from "@/hooks/data/useGuest";
import { handleErrorApi } from "@/utils/handleError";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DishStatus } from "@/constants/type";

export default function MenuOrder() {
    const router = useRouter();
    const { mutateAsync: orderMutate } = useGuestOrderMutation();
    const { data } = useGetDishes();
    const dishes = useMemo(() => data?.payload.data || [], [data]);

    const dishesHasMap = useMemo(
        () =>
            dishes.reduce((map, dish) => {
                map.set(dish.id, dish);
                return map;
            }, new Map<number, (typeof dishes)[0]>()),
        [dishes]
    );

    const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);

    const handleQuantityChange = useCallback((dishId: number) => {
        return (quantity: number) => {
            setOrders((prevOrders) => {
                const existingOrderIndex = prevOrders.findIndex((order) => order.dishId === dishId);
                if (existingOrderIndex > -1) {
                    const updatedOrders = [...prevOrders];
                    if (quantity > 0) {
                        updatedOrders[existingOrderIndex].quantity = quantity;
                    } else {
                        updatedOrders.splice(existingOrderIndex, 1);
                    }
                    return updatedOrders;
                } else if (quantity > 0) {
                    return [...prevOrders, { dishId, quantity }];
                }
                return prevOrders;
            });
        };
    }, []);

    const totalPrice = orders.reduce((total, order) => {
        const price = dishesHasMap.get(order.dishId)?.price || 0;
        total += price * order.quantity;
        return total;
    }, 0);

    const handleOrderSubmit = useCallback(async () => {
        if (orders.length === 0) return;
        try {
            const res = await orderMutate(orders);
            router.push("/guest/order");
            toast.success(res.payload.message);
            setOrders([]);
        } catch (error) {
            handleErrorApi(error);
        }
    }, [orders, orderMutate, router]);

    return (
        <>
            {dishes
                .filter((dish) => dish.status != DishStatus.Hidden)
                .map((dish) => {
                    const isAvailable = dish.status === DishStatus.Available;
                    return (
                        <div key={dish.id} className="flex gap-4">
                            <div className="flex-shrink-0 relative  rounded-md overflow-hidden">
                                <Image
                                    src={dish.image}
                                    alt={dish.name}
                                    height={100}
                                    width={100}
                                    quality={100}
                                    className="object-cover w-[80px] h-[80px]"
                                    onError={(e) => {
                                        e.currentTarget.src = "/placeholderimage.webp";
                                    }}
                                />
                                {!isAvailable && (
                                    <div className="absolute inset-0 bg-orange-400/80 flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold text-center">Hêt hàng</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm">{dish.name}</h3>
                                <p className="text-xs">{dish.description}</p>
                                <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
                            </div>
                            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                                <Quantity
                                    onChange={isAvailable ? handleQuantityChange(dish.id) : () => {}}
                                    disable={!isAvailable}
                                />
                            </div>
                        </div>
                    );
                })}
            <div className="sticky bottom-0">
                <Button className="w-full justify-between" onClick={handleOrderSubmit} disabled={orders.length === 0}>
                    <span>Đặt hàng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>
    );
}
