"use client";

import { useAppContext } from "@/app/app-provider";
import { GuestSocket } from "@/components/guest-socket";
import ManageSocket from "@/components/manage-socket";
import { Role } from "@/constants/type";

export function SocketListener() {
    const { role } = useAppContext();

    if (!role) return null;

    if (role == Role.Guest) return <GuestSocket />;
    if (role == Role.Owner || role == Role.Employee) return <ManageSocket />;

    return null;
}
