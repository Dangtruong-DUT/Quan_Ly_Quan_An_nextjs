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
import Link from "next/link";
import { useLogoutMutation } from "@/app/queries/useAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAccountProfile } from "@/app/queries/useAccount";
import { useCallback } from "react";
import { useAppContext } from "@/app/app-provider";

export default function DropdownAvatar() {
    const router = useRouter();
    const { setIsAuthenticated } = useAppContext();
    const { mutateAsync: logoutMutateAsync, isPending } = useLogoutMutation();
    const handleLogout = useCallback(async () => {
        try {
            await logoutMutateAsync();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsAuthenticated(false);
            toast.success("Logout successful");
            router.refresh();
            router.push("/");
        }
    }, [logoutMutateAsync, router, setIsAuthenticated]);

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
