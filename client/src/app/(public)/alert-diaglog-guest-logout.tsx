import { useAppContext } from "@/app/app-provider";
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
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function GuestConfirmLogout({ className }: { className?: string }) {
    const { setRole } = useAppContext();
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
                <button className={cn(className, "cursor-pointer")}>Đăng xuất</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Bạn có chắn chắn đăng xuất</AlertDialogTitle>
                    <AlertDialogDescription>
                        Bạn sẽ không thể truy cập vào các chức năng của hệ thống nếu không đăng nhập.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Huỷ</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>Tiếp tục</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
