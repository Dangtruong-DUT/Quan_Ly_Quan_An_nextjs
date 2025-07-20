"use client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { toast } from "sonner";
import { useCallback } from "react";
import { useLogoutMutation } from "@/hooks/data/useAuth";
import { useAccountProfile } from "@/hooks/data/useAccount";
import { useAppStore } from "@/providers/app-provider";
import { useRouter } from "@/i18n/navigation";

export default function DropdownAvatar() {
    const router = useRouter();
    const setRole = useAppStore((state) => state.setRole);
    const { mutateAsync: logoutMutateAsync, isPending } = useLogoutMutation();
    const handleLogout = useCallback(async () => {
        try {
            await logoutMutateAsync();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setRole(undefined);
            toast.success("Logout successful");
            router.refresh();
            router.push("/");
        }
    }, [logoutMutateAsync, router, setRole]);

    const { data } = useAccountProfile();
    const account = data?.payload.data || { avatar: undefined, name: "USER" };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                    <Avatar>
                        <AvatarImage src={account.avatar ?? undefined} alt={account.name} />
                        <AvatarFallback>{account.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{account.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href={"/manage/setting"} className="cursor-pointer">
                        Setting
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Helper</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
