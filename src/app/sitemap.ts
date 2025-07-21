import nextRequestDishesApi from "@/api/nextToBackend/dishes";
import { locales } from "@/i18n/config";
import { generateSlug } from "@/utils/common";
import type { MetadataRoute } from "next";

const staticRoutes: MetadataRoute.Sitemap = [
    {
        url: "",
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 1,
    },
    {
        url: "/login",
        lastModified: new Date(),
        changeFrequency: "yearly" as const,
        priority: 0.5,
    },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const result = await nextRequestDishesApi.nextList();
    const dishes = result?.payload.data || [];

    const dishRoutes = dishes.map((dish) => ({
        url: `/dishes/${generateSlug({ text: dish.name, id: String(dish.id) })}`,
        lastModified: new Date(dish.updatedAt || dish.createdAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
    }));

    const localizedDishRoutes = locales.flatMap((locale) =>
        dishRoutes.map((route) => ({
            ...route,
            url: `${process.env.NEXT_PUBLIC_URL}/${locale}${route.url}`,
        }))
    );
    const localeStaticRoutes = locales.flatMap((locale) =>
        staticRoutes.map((route) => ({
            ...route,
            url: `${process.env.NEXT_PUBLIC_URL}/${locale}${route.url}`,
        }))
    );

    return [...localeStaticRoutes, ...localizedDishRoutes];
}
