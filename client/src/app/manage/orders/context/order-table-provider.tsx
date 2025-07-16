"use client";

import { OrderObjectByGuestID } from "@/app/manage/orders/_components/order.service";
import { OrderStatusValues } from "@/constants/type";
import { useUpdateOrderMutation } from "@/hooks/data/useOrder";
import { handleErrorApi } from "@/utils/handleError";
import { omit } from "lodash";
import React, { createContext, useCallback, useState } from "react";

type changeStatusPropTypes = {
    orderId: number;
    dishId: number;
    status: (typeof OrderStatusValues)[number];
    quantity: number;
};

interface OrderObjectContextProps {
    setOrderIdEdit: (value: number | undefined) => void;
    orderIdEdit: number | undefined;
    changeStatus: (payload: changeStatusPropTypes) => void;
    orderObjectByGuestId: OrderObjectByGuestID;
    setOrderObjectByGuestId: React.Dispatch<React.SetStateAction<OrderObjectByGuestID>>;
}

export const OrderTableContext = createContext<OrderObjectContextProps>({
    setOrderIdEdit: () => {},
    orderIdEdit: undefined as number | undefined,
    changeStatus: () => {},
    orderObjectByGuestId: {} as OrderObjectByGuestID,
    setOrderObjectByGuestId: () => {},
});

export function useOrderTableContext() {
    return React.useContext(OrderTableContext);
}

export default function OrderTableProvider({ children }: { children: React.ReactNode }) {
    const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();
    const [orderObjectByGuestId, setOrderObjectByGuestId] = useState<OrderObjectByGuestID>({});

    const { mutateAsync: updateOrderMutate } = useUpdateOrderMutation();

    const changeStatus = useCallback(
        async (data: {
            orderId: number;
            dishId: number;
            status: (typeof OrderStatusValues)[number];
            quantity: number;
        }) => {
            try {
                const body = omit(data, ["orderId"]);
                await updateOrderMutate({
                    orderId: data.orderId,
                    body,
                });
            } catch (error) {
                handleErrorApi(error);
            }
        },
        [updateOrderMutate]
    );
    return (
        <OrderTableContext
            value={{
                setOrderIdEdit,
                orderIdEdit,
                changeStatus,
                orderObjectByGuestId,
                setOrderObjectByGuestId,
            }}
        >
            {children}
        </OrderTableContext>
    );
}
