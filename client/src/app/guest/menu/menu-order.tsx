"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useGetDishes } from "@/hooks/data/useDishes";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import Quantity from "@/app/guest/menu/quantity";
import { useCallback, useMemo, useState } from "react";
import { GuestCreateOrdersBodyType } from "@/utils/validation/guest.schema";

export default function MenuOrder() {
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

    return (
        <>
            {dishes.map((dish) => (
                <div key={dish.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                        <Image
                            src={dish.image}
                            alt={dish.name}
                            height={100}
                            width={100}
                            quality={100}
                            className="object-cover w-[80px] h-[80px] rounded-md"
                            onError={(e) => {
                                e.currentTarget.src = "/placeholderimage.webp";
                            }}
                        />
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-sm">{dish.name}</h3>
                        <p className="text-xs">{dish.description}</p>
                        <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
                    </div>
                    <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                        <Quantity onChange={handleQuantityChange(dish.id)} />
                    </div>
                </div>
            ))}
            <div className="sticky bottom-0">
                <Button className="w-full justify-between">
                    <span>Giỏ hàng · {orders.length} món</span>
                    <span>{formatCurrency(totalPrice)}</span>
                </Button>
            </div>
        </>
    );
}
