import { DishStatus, OrderStatus, TableStatus } from "@/constants/type";

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
