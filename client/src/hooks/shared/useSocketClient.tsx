import { useAppContext } from "@/app/app-provider";
import { clientSocket } from "@/service/socket/socket";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

type UseSocketClientReturnType = {
    socket: Socket | null;
};

export function useSocketClient(): UseSocketClientReturnType {
    const { role } = useAppContext();
    useEffect(() => {
        if (role) {
            clientSocket.connect();
        }
        return () => {
            if (!role) {
                clientSocket.disconnect();
            }
        };
    }, [role]);

    return { socket: clientSocket.socket };
}
