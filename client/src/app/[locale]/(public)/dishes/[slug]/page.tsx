import nextRequestDishesApi from "@/api/nextToBackend/dishes";
import DishDetail from "@/app/[locale]/(public)/dishes/[slug]/dish-detail";
import { generateSlug, getIdFromSlug, WrapperServerCallApi } from "@/utils/common";
import { Metadata, ResolvingMetadata } from "next";

type Props = {
    params: Promise<{ slug: string; locale: string }>;
};

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const { slug, locale } = await params;

    const id = getIdFromSlug(slug);

    const res = await WrapperServerCallApi({
        apiCallFn: () => nextRequestDishesApi.getDishById(Number(id)),
    });

    const product = res?.payload.data;

    // optionally access and extend (rather than replace) parent metadata
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: product?.name || "Dish Details",
        description: product?.description || "Details of the dish",
        openGraph: {
            images: [product?.image || "", ...previousImages],
            title: product?.name || "Dish Details",
            description: product?.description || "Details of the dish",
            type: "website",
            url: `${process.env.NEXT_PUBLIC_URL}/${locale}/${slug}`,
            siteName: "TaplamIT - Restaurant Management Software",
            locale,
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_URL}/${locale}/${slug}`,
            languages: {
                "en-US": "/en-US",
                "vi-VN": "/vi-VN",
            },
        },
    };
}

export async function generateStaticParams() {
    const data = await WrapperServerCallApi({
        apiCallFn: () => nextRequestDishesApi.nextList(),
    });
    const dishes = data?.payload.data || [];
    return dishes.map((dish) => ({
        slug: generateSlug({ text: dish.name, id: String(dish.id) }),
    }));
}

export default async function DishPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const id = getIdFromSlug(slug);
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
