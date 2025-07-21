import { useAppStore } from "@/providers/app-provider";
import { clientSocket } from "@/services/socket/socket";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

type UseSocketClientReturnType = {
    socket: Socket | null;
};

export function useSocketClient(): UseSocketClientReturnType {
    const role = useAppStore((state) => state.role);
    const [socket, setSocket] = useState<null | Socket>(null);
    useEffect(() => {
        if (role) {
            const socket = clientSocket.connect();
            setSocket(socket);
        } else {
            setSocket(null);
            clientSocket.disconnect();
        }

        return () => {
            if (!role) {
                clientSocket.disconnect();
            }
        };
    }, [role]);

    return { socket };
}
