import { Role } from "@/constants/type";
import { useLogoutMutation } from "@/hooks/data/useAuth";
import { useGuestLogoutMutation } from "@/hooks/data/useGuest";
import { useSocketClient } from "@/hooks/shared/useSocketClient";
import { useAppStore } from "@/providers/app-provider";
import { handleErrorApi } from "@/utils/handleError";
import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useShallow } from "zustand/react/shallow";

export function LogoutSocket() {
    const { setRole, role } = useAppStore(
        useShallow((state) => ({
            setRole: state.setRole,
            role: state.role,
        }))
    );
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
