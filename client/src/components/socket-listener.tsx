"use client";

import { GuestSocket } from "@/components/guest-socket";
import { LogoutSocket } from "@/components/logout-soket";
import ManageSocket from "@/components/manage-socket";
import { Role } from "@/constants/type";
import { useAppStore } from "@/providers/app-provider";

export function SocketListener() {
    const role = useAppStore((state) => state.role);

    if (!role) return null;

    if (role == Role.Guest)
        return (
            <>
                <LogoutSocket />
                <GuestSocket />
            </>
        );
    if (role == Role.Owner || role == Role.Employee)
        return (
            <>
                <ManageSocket />
                <LogoutSocket />
            </>
        );

    return null;
}
