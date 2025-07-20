"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { DishListResType } from "@/utils/validation/dish.schema";
import { UpdateOrderBody, UpdateOrderBodyType } from "@/utils/validation/order.schema";

import { OrderStatus, OrderStatusValues } from "@/constants/type";
import { useOrderStatus } from "@/helpers/common";
import { useGetOrderDetailQuery } from "@/hooks/data/useOrder";
import DishesDialog from "@/app/[locale]/manage/orders/_components/dishes-dialog";
import { useOrderTableContext } from "@/app/[locale]/manage/orders/context/order-table-provider";
import { handleErrorApi } from "@/utils/handleError";
import { useTranslations } from "next-intl";

type EditOrderProps = {
    id?: number;
    setId: (id: number | undefined) => void;
    onSubmitSuccess?: () => void;
};

export default function EditOrder({ id, setId, onSubmitSuccess }: EditOrderProps) {
    const getOrderStatus = useOrderStatus();
    const t = useTranslations("EditOrder");
    const { data } = useGetOrderDetailQuery(id);
    const [selectedDish, setSelectedDish] = useState<DishListResType["data"][number] | undefined>(undefined);
    const { changeStatus } = useOrderTableContext();

    const form = useForm<UpdateOrderBodyType>({
        resolver: zodResolver(UpdateOrderBody),
        defaultValues: {
            status: OrderStatus.Pending,
            dishId: 0,
            quantity: 1,
        },
    });

    useEffect(() => {
        if (data?.payload) {
            const { status, quantity, dishSnapshot } = data.payload.data;
            setSelectedDish(dishSnapshot);
            form.reset({
                status: status,
                dishId: Number(dishSnapshot.dishId),
                quantity: quantity,
            });
        }
    }, [data, form]);

    const onSubmit = useCallback(
        async (values: UpdateOrderBodyType) => {
            try {
                if (!id) return;
                await changeStatus({
                    orderId: id,
                    dishId: values.dishId,
                    status: values.status,
                    quantity: values.quantity,
                });
                onSubmitSuccess?.();
            } catch (error) {
                handleErrorApi(error);
            }
        },
        [id, changeStatus, onSubmitSuccess]
    );

    const handleClose = () => {
        setId(undefined);
    };

    return (
        <Dialog open={Boolean(id)} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
                <DialogHeader>
                    <DialogTitle>{t("title")}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        id="edit-order-form"
                        onSubmit={form.handleSubmit(onSubmit, console.error)}
                        noValidate
                        className="grid gap-6"
                    >
                        {/* Món ăn */}
                        <FormField
                            control={form.control}
                            name="dishId"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel>{t("dish")}</FormLabel>
                                    <div className="col-span-2 flex items-center gap-4">
                                        <Avatar className="w-[50px] h-[50px]">
                                            <AvatarImage src={selectedDish?.image} />
                                            <AvatarFallback>{selectedDish?.name}</AvatarFallback>
                                        </Avatar>
                                        <div>{selectedDish?.name}</div>
                                    </div>
                                    <DishesDialog
                                        onChoose={(dish) => {
                                            field.onChange(dish.id);
                                            setSelectedDish(dish);
                                        }}
                                    />
                                </FormItem>
                            )}
                        />

                        {/* Số lượng */}
                        <FormField
                            control={form.control}
                            name="quantity"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="quantity">{t("quantity")}</Label>
                                    <div className="col-span-3">
                                        <Input
                                            id="quantity"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            className="w-16 text-center"
                                            value={field.value}
                                            onChange={(e) => {
                                                const value = Number(e.target.value);
                                                if (!isNaN(value)) field.onChange(value);
                                            }}
                                        />
                                        <FormMessage />
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Trạng thái */}
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="grid grid-cols-4 items-center gap-4">
                                    <FormLabel>{t("status")}</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl className="col-span-3">
                                            <SelectTrigger className="w-[200px]">
                                                <SelectValue placeholder="Chọn trạng thái" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {OrderStatusValues.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {getOrderStatus(status)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>

                <DialogFooter>
                    <Button type="submit" form="edit-order-form">
                        {t("saveButton")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
