import envConfig from "@/config/app.config";
import { clientSessionToken } from "@/service/storage/clientSessionToken";
import { io } from "socket.io-client";

const accessToken = clientSessionToken.accessToken;

const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
        Authorization: `Bearer ${accessToken}`,
    },
});

export default socket;
