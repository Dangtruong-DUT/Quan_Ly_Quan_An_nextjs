import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useGuestLogoutMutation } from "@/hooks/data/useGuest";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/providers/app-provider";
import { useCallback } from "react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function GuestConfirmLogout({ className }: { className?: string }) {
    const tCommon = useTranslations("Common");
    const tNavigation = useTranslations("Navigation");
    const tLogoutDialog = useTranslations("LogoutDialog");

    const setRole = useAppStore((state) => state.setRole);
    const router = useRouter();
    const { mutateAsync: logoutMutate } = useGuestLogoutMutation();

    const handleLogout = useCallback(async () => {
        try {
            await logoutMutate();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            router.push("/");
            setRole(undefined);
        }
    }, [logoutMutate, router, setRole]);

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className={cn(className, "cursor-pointer text-left")}>{tNavigation("logout")}</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{tLogoutDialog("title")}</AlertDialogTitle>
                    <AlertDialogDescription>{tLogoutDialog("description")}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>{tCommon("continue")}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
