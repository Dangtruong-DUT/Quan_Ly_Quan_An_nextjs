import envConfig from "@/config/app.config";
import { DishStatus, OrderStatus, TableStatus } from "@/constants/type";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Locale } from "@/i18n/config";

export const getDishStatus = async (status: (typeof DishStatus)[keyof typeof DishStatus], locale: Locale = "vi") => {
    const t = await getTranslations({ locale, namespace: "Status.DishStatus" });

    switch (status) {
        case DishStatus.Available:
            return t("Available");
        case DishStatus.Unavailable:
            return t("Unavailable");
        default:
            return t("Hidden");
    }
};

export const getOrderStatus = async (status: (typeof OrderStatus)[keyof typeof OrderStatus], locale: Locale = "vi") => {
    const t = await getTranslations({ locale, namespace: "Status.OrderStatus" });

    switch (status) {
        case OrderStatus.Delivered:
            return t("Delivered");
        case OrderStatus.Paid:
            return t("Paid");
        case OrderStatus.Pending:
            return t("Pending");
        case OrderStatus.Processing:
            return t("Processing");
        default:
            return t("Rejected");
    }
};

export const getTableStatus = async (status: (typeof TableStatus)[keyof typeof TableStatus], locale: Locale = "vi") => {
    const t = await getTranslations({ locale, namespace: "Status.TableStatus" });

    switch (status) {
        case TableStatus.Available:
            return t("Available");
        case TableStatus.Reserved:
            return t("Reserved");
        default:
            return t("Hidden");
    }
};

// Client-side hooks for components
export const useDishStatus = () => {
    const t = useTranslations("Status.DishStatus");

    return (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
        switch (status) {
            case DishStatus.Available:
                return t("Available");
            case DishStatus.Unavailable:
                return t("Unavailable");
            default:
                return t("Hidden");
        }
    };
};

export const useOrderStatus = () => {
    const t = useTranslations("Status.OrderStatus");

    return (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
        switch (status) {
            case OrderStatus.Delivered:
                return t("Delivered");
            case OrderStatus.Paid:
                return t("Paid");
            case OrderStatus.Pending:
                return t("Pending");
            case OrderStatus.Processing:
                return t("Processing");
            default:
                return t("Rejected");
        }
    };
};

export const useTableStatus = () => {
    const t = useTranslations("Status.TableStatus");

    return (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
        switch (status) {
            case TableStatus.Available:
                return t("Available");
            case TableStatus.Reserved:
                return t("Reserved");
            default:
                return t("Hidden");
        }
    };
};

// Legacy functions for backward compatibility (deprecated)
export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
    switch (status) {
        case DishStatus.Available:
            return "Có sẵn";
        case DishStatus.Unavailable:
            return "Không có sẵn";
        default:
            return "Ẩn";
    }
};

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
    switch (status) {
        case OrderStatus.Delivered:
            return "Đã phục vụ";
        case OrderStatus.Paid:
            return "Đã thanh toán";
        case OrderStatus.Pending:
            return "Chờ xử lý";
        case OrderStatus.Processing:
            return "Đang nấu";
        default:
            return "Từ chối";
    }
};

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
    switch (status) {
        case TableStatus.Available:
            return "Có sẵn";
        case TableStatus.Reserved:
            return "Đã đặt";
        default:
            return "Ẩn";
    }
};

export const getTableLink = ({
    token,
    tableNumber,
    locale,
}: {
    token: string;
    tableNumber: number;
    locale: string;
}) => {
    return `${envConfig.NEXT_PUBLIC_URL}/${locale}/tables/${tableNumber}?token=${token}`;
};

export const OrderStatusIcon = {
    [OrderStatus.Pending]: Loader,
    [OrderStatus.Processing]: CookingPot,
    [OrderStatus.Rejected]: BookX,
    [OrderStatus.Delivered]: Truck,
    [OrderStatus.Paid]: HandCoins,
};
