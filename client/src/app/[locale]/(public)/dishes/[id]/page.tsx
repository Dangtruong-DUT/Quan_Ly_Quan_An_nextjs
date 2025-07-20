import nextRequestDishesApi from "@/api/nextToBackend/dishes";
import DishDetail from "@/app/[locale]/(public)/dishes/[id]/dish-detail";
import { WrapperServerCallApi } from "@/utils/common";

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

    return <DishDetail dish={dish} />;
}
