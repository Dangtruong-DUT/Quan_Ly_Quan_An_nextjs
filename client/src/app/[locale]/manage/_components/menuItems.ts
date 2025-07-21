import { Role } from "@/constants/type";
import { Home, ShoppingCart, Users2, Salad, Table } from "lucide-react";

const menuItems = [
    {
        title: "dashboard",
        Icon: Home,
        href: "/manage/dashboard",
        role: [Role.Owner, Role.Employee],
    },
    {
        title: "orders",
        Icon: ShoppingCart,
        href: "/manage/orders",
        role: [Role.Owner, Role.Employee],
    },
    {
        title: "tables",
        Icon: Table,
        href: "/manage/tables",
        role: [Role.Owner, Role.Employee],
    },
    {
        title: "dishes",
        Icon: Salad,
        href: "/manage/dishes",
        role: [Role.Owner, Role.Employee],
    },
    {
        title: "accounts",
        Icon: Users2,
        href: "/manage/accounts",
        role: [Role.Owner],
    },
];

export default menuItems;
