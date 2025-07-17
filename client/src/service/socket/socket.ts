import envConfig from "@/config/app.config";
import { clientSessionToken } from "@/service/storage/clientSessionToken";
import { io } from "socket.io-client";

class ClientSocket {
    private _socket: ReturnType<typeof io> | null = null;
    private static instance: ClientSocket;

    private constructor(private clientSession: typeof clientSessionToken) {}

    public static getInstance(): ClientSocket {
        if (!ClientSocket.instance) {
            ClientSocket.instance = new ClientSocket(clientSessionToken);
        }
        return ClientSocket.instance;
    }

    public connect() {
        if (this._socket) {
            if (this._socket.connected) return this._socket;
            this._socket.connect();
            return this._socket;
        }

        const accessToken = this.clientSession.accessToken;
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
        return this._socket;
    }

    public disconnect() {
        if (this._socket) {
            this._socket.disconnect();
            this._socket = null;
        }
    }
    public get isConnected() {
        return !!this._socket?.connected;
    }
}

export const clientSocket = ClientSocket.getInstance();
