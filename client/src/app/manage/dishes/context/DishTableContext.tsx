"use client";

import { DishListResType } from "@/utils/validation/dish.schema";
import { createContext, use, useState } from "react";

export type DishItem = DishListResType["data"][0];

type DishTableContextType = {
    setDishIdEdit: (value: number | undefined) => void;
    dishIdEdit: number | undefined;
    dishDelete: DishItem | null;
    setDishDelete: (value: DishItem | null) => void;
};

const DishTableContext = createContext<DishTableContextType>({
    setDishIdEdit: () => {},
    dishIdEdit: undefined,
    dishDelete: null,
    setDishDelete: () => {},
});

export function useDishTableContext() {
    return use(DishTableContext);
}

function DishTableProvider({ children }: { children: React.ReactNode }) {
    const [dishIdEdit, setDishIdEdit] = useState<number | undefined>();
    const [dishDelete, setDishDelete] = useState<DishItem | null>(null);
    return (
        <DishTableContext value={{ dishIdEdit, setDishIdEdit, dishDelete, setDishDelete }}>{children}</DishTableContext>
    );
}

export default DishTableProvider;
