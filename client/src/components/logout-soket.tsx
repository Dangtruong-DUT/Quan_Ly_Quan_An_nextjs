import { useAppContext } from "@/app/app-provider";
import { Role } from "@/constants/type";
import { useLogoutMutation } from "@/hooks/data/useAuth";
import { useGuestLogoutMutation } from "@/hooks/data/useGuest";
import { useSocketClient } from "@/hooks/shared/useSocketClient";
import { handleErrorApi } from "@/utils/handleError";
import { useRouter } from "next/dist/client/components/navigation";
import { useEffect } from "react";

export function LogoutSocket() {
    const { setRole, role } = useAppContext();
    const router = useRouter();
    const { socket } = useSocketClient();
    const { mutateAsync: logoutMutate } = useLogoutMutation();
    const { mutateAsync: guestLogoutMutate } = useGuestLogoutMutation();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                if (role == Role.Guest) {
                    await guestLogoutMutate();
                } else {
                    await logoutMutate();
                }
                setRole(undefined);
            } catch (error) {
                handleErrorApi(error);
            } finally {
                router.push("/");
            }
        };

        socket?.on("logout", handleLogout);

        return () => {
            socket?.off("logout", handleLogout);
        };
    }, [socket, logoutMutate, guestLogoutMutate, router, role, setRole]);

    return null;
}
