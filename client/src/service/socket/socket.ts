import envConfig from "@/config/app.config";
import { clientSessionToken } from "@/service/storage/clientSessionToken";
import { io } from "socket.io-client";

class ClientSocket {
    private _socket: ReturnType<typeof io> | null = null;
    private static instance: ClientSocket;

    private constructor() {}

    public static getInstance(): ClientSocket {
        if (!ClientSocket.instance) {
            ClientSocket.instance = new ClientSocket();
        }
        return ClientSocket.instance;
    }

    public connect() {
        if (this._socket && this._socket.connected) return;

        const accessToken = clientSessionToken.accessToken;
        if (!accessToken) {
            console.error("No access token found. Cannot connect to socket.");
            return;
        }
        this._socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
            auth: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        this._socket.on("connect", () => {
            console.log("Socket connected:", this._socket?.id);
        });

        this._socket.on("disconnect", (reason) => {
            console.log("Socket disconnected:", reason);
        });
    }

    public disconnect() {
        if (this._socket && this._socket.connected) {
            this._socket.disconnect();
            this._socket = null;
        }
    }

    get socket() {
        return this._socket;
    }
}

export const clientSocket = ClientSocket.getInstance();
