import nextRequestDishesApi from "@/api/nextToBackend/dishes";
import { WrapperServerCallApi } from "@/utils/common";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import Image from "next/image";

export default async function DishPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await WrapperServerCallApi({
        apiCallFn: () => nextRequestDishesApi.getDishById(Number(id)),
    });

    const dish = data?.payload.data;
    if (!dish) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-gray-500 text-lg">Dish not found</div>
        );
    }

    return (
        <div className=" p-4 sm:p-6 md:p-10">
            <div className="flex flex-col">
                <div className="w-full  flex-shrink-0">
                    <Image
                        src={dish.image || "/placeholderimage.webp"}
                        width={260}
                        height={260}
                        alt={dish.name}
                        className="w-full h-[260px] object-cover rounded-xl"
                        quality={100}
                        priority
                    />
                </div>
                <div className="flex flex-col justify-between space-y-5">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
                        {dish.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-base md:text-lg leading-relaxed text-balance">
                        {dish.description}
                    </p>
                    <p className="text-2xl md:text-3xl font-semibold text-indigo-600 dark:text-indigo-400">
                        {formatCurrency(dish.price)}
                    </p>
                </div>
            </div>
        </div>
    );
}
