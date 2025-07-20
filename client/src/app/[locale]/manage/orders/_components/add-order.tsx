"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import Quantity from "@/app/[locale]/guest/menu/quantity";
import Image from "next/image";
import { DishStatus } from "@/constants/type";
import { GetListGuestsResType } from "@/utils/validation/account.schema";
import { CreateOrdersBodyType } from "@/utils/validation/order.schema";
import { GuestLoginBody, GuestLoginBodyType } from "@/utils/validation/guest.schema";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import GuestsDialog from "@/app/[locale]/manage/orders/_components/guests-dialog";
import TablesDialog from "@/app/[locale]/manage/orders/_components/tables-dialog";
import { useGetDishes } from "@/hooks/data/useDishes";
import { useCreateGuestMutation } from "@/hooks/data/useAccount";
import { useCreateOrdersMutation } from "@/hooks/data/useOrder";
import { handleErrorApi } from "@/utils/handleError";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export default function AddOrder() {
    const t = useTranslations("AddOrder");
    const [open, setOpen] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<GetListGuestsResType["data"][0] | null>(null);
    const [isNewGuest, setIsNewGuest] = useState(true);
    const [orders, setOrders] = useState<CreateOrdersBodyType["orders"]>([]);

    const { data } = useGetDishes();
    const dishesMapObj = useMemo(() => {
        const dishList = data?.payload.data || [];
        return dishList.reduce((acc, dish) => {
            acc[dish.id] = dish;
            return acc;
        }, {} as Record<number, (typeof dishList)[0]>);
    }, [data]);

    const totalPrice = useMemo(() => {
        return orders.reduce((sum, order) => {
            const dish = dishesMapObj[order.dishId];
            return sum + (dish ? dish.price * order.quantity : 0);
        }, 0);
    }, [dishesMapObj, orders]);

    const form = useForm<GuestLoginBodyType>({
        resolver: zodResolver(GuestLoginBody),
        defaultValues: {
            name: "",
            tableNumber: 0,
        },
    });

    const handleQuantityChange = useCallback(
        (dishId: number, quantity: number) => {
            setOrders((prevOrders) => {
                if (quantity === 0) {
                    return prevOrders.filter((order) => order.dishId !== dishId);
                }
                const index = prevOrders.findIndex((order) => order.dishId === dishId);
                if (index === -1) {
                    return [...prevOrders, { dishId, quantity }];
                }
                const newOrders = [...prevOrders];
                newOrders[index] = { ...newOrders[index], quantity };
                return newOrders;
            });
        },
        [setOrders]
    );

    const { mutateAsync: createGuestMutate, isPending: isCreateGuest } = useCreateGuestMutation();
    const { mutateAsync: createOrderMutate, isPending: isCreateOrder } = useCreateOrdersMutation();

    const isLoading = isCreateGuest || isCreateOrder;

    const onReset = useCallback(() => {
        setOrders([]);
        setSelectedGuest(null);
        form.reset();
        setIsNewGuest(true);
        setOpen(false);
    }, [form, setOrders, setSelectedGuest, setIsNewGuest]);

    const handleOrder = useCallback(async () => {
        if (isLoading) return;
        try {
            let Guest = selectedGuest;
            if (isNewGuest) {
                const res = await createGuestMutate({
                    name: form.getValues("name"),
                    tableNumber: form.getValues("tableNumber"),
                });
                Guest = res.payload.data;
            }

            if (!Guest) {
                toast.error(t("pleaseSelectGuest"));
                return;
            }
            const orderData: CreateOrdersBodyType = {
                guestId: Number(Guest.id),
                orders,
            };

            await createOrderMutate(orderData);
            setOrders([]);

            onReset();
        } catch (error) {
            handleErrorApi(error, form.setError);
        }
    }, [isLoading, isNewGuest, form, createGuestMutate, createOrderMutate, onReset, orders, selectedGuest, t]);

    return (
        <Dialog
            onOpenChange={(value) => {
                if (!value) {
                    onReset();
                }
                setOpen(value);
            }}
            open={open}
        >
            <DialogTrigger asChild>
                <Button size="sm" className="h-7 gap-1">
                    <PlusCircle className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">{t("addOrder")}</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <Label htmlFor="isNewGuest">{t("newGuest")}</Label>
                    <div className="col-span-3 flex items-center">
                        <Switch id="isNewGuest" checked={isNewGuest} onCheckedChange={setIsNewGuest} />
                    </div>
                </div>
                {isNewGuest && (
                    <Form {...form}>
                        <form
                            noValidate
                            className="grid auto-rows-max items-start gap-4 md:gap-8"
                            id="add-employee-form"
                        >
                            <div className="grid gap-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                                <Label htmlFor="name">{t("guestName")}</Label>
                                                <div className="col-span-3 w-full space-y-2">
                                                    <Input id="name" className="w-full" {...field} />
                                                    <FormMessage />
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="tableNumber"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                                                <Label htmlFor="tableNumber">{t("tableNumber")}</Label>
                                                <div className="col-span-3 w-full space-y-2">
                                                    <div className="flex items-center gap-4">
                                                        <div>{field.value}</div>
                                                        <TablesDialog
                                                            onChoose={(table) => {
                                                                field.onChange(table.number);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </form>
                    </Form>
                )}
                {!isNewGuest && (
                    <GuestsDialog
                        onChoose={(guest) => {
                            setSelectedGuest(guest);
                        }}
                    />
                )}
                {!isNewGuest && selectedGuest && (
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="selectedGuest">{t("selectedGuest")}</Label>
                        <div className="col-span-3 w-full gap-4 flex items-center">
                            <div>
                                {selectedGuest.name} (#{selectedGuest.id})
                            </div>
                            <div>
                                {t("tableLabel")}: {selectedGuest.tableNumber}
                            </div>
                        </div>
                    </div>
                )}
                {Object.values(dishesMapObj)
                    .filter((dish) => dish.status !== DishStatus.Hidden)
                    .map((dish) => (
                        <div
                            key={dish.id}
                            className={cn("flex gap-4", {
                                "pointer-events-none": dish.status === DishStatus.Unavailable,
                            })}
                        >
                            <div className="flex-shrink-0 relative">
                                {dish.status === DishStatus.Unavailable && (
                                    <span className="absolute inset-0 flex items-center justify-center text-sm">
                                        {t("outOfStock")}
                                    </span>
                                )}
                                <Image
                                    src={dish.image}
                                    alt={dish.name}
                                    height={100}
                                    width={100}
                                    quality={100}
                                    className="object-cover w-[80px] h-[80px] rounded-md"
                                />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-sm">{dish.name}</h3>
                                <p className="text-xs">{dish.description}</p>
                                <p className="text-xs font-semibold">{formatCurrency(dish.price)}</p>
                            </div>
                            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
                                <Quantity
                                    disable={dish.status === DishStatus.Unavailable}
                                    onChange={(value) => handleQuantityChange(dish.id, value)}
                                    initialValue={0}
                                />
                            </div>
                        </div>
                    ))}
                <DialogFooter>
                    <Button className="w-full justify-between" onClick={handleOrder} disabled={orders.length === 0}>
                        <span>
                            {t("orderButton")} · {orders.length} {t("items")}
                        </span>
                        <span>{formatCurrency(totalPrice)}</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
