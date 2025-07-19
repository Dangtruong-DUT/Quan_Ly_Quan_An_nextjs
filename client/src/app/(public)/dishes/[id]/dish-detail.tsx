import { formatCurrency } from "@/utils/formatting/formatCurrency";
import { DishResType } from "@/utils/validation/dish.schema";
import Image from "next/image";

interface DishDetailProps {
    dish?: DishResType["data"];
}

export default function DishDetail({ dish }: DishDetailProps) {
    if (!dish) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-gray-500 text-lg">Dish not found</div>
        );
    }

    return (
        <div className="p-4 sm:p-6 md:p-10">
            <div className="flex flex-col">
                <div className="flex flex-col justify-between space-y-5">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white leading-snug tracking-tight">
                        {dish.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg md:text-xl leading-relaxed text-balance">
                        {dish.description}
                    </p>
                    <p className="text-1xl sm:text-2xl font-semibold text-orange-500">{formatCurrency(dish.price)}</p>
                </div>
                <div className="w-full mt-4 flex-shrink-0">
                    <Image
                        src={dish.image || "/placeholderimage.webp"}
                        width={320}
                        height={320}
                        alt={dish.name}
                        className="w-full h-[320px] object-cover rounded-xl shadow-md"
                        quality={100}
                        priority
                    />
                </div>
            </div>
        </div>
    );
}
