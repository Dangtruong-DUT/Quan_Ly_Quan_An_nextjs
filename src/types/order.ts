import { OrderStatus } from "@/constants/type";

export type OrderStatusType = (typeof OrderStatus)[keyof typeof OrderStatus];
