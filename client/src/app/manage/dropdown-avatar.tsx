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

export default function DropdownAvatar() {
    const router = useRouter();
    const { mutateAsync: logoutMutateAsync, isPending } = useLogoutMutation();
    const handleLogout = async () => {
        try {
            await logoutMutateAsync();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            toast.success("Logout successful");
            router.push("/");
            router.refresh();
        }
    };

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
                        Cài đặt
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
                    Đăng xuất
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
