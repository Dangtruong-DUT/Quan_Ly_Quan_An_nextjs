"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuestLoginBody, GuestLoginBodyType } from "@/utils/validation/guest.schema";
import { useParams, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { handleErrorApi } from "@/utils/handleError";
import { useGuestLoginMutation } from "@/hooks/data/useGuest";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAppStore } from "@/providers/app-provider";

export default function GuestLoginForm() {
    const searchParams = useSearchParams();
    const params = useParams<{ number: string }>();
    const token = searchParams.get("token") || "";
    const tableNumber = Number(params.number);

    const router = useRouter();
    const { mutateAsync: loginMutate, isPending } = useGuestLoginMutation();
    const setRole = useAppStore((state) => state.setRole);

    const form = useForm<GuestLoginBodyType>({
        resolver: zodResolver(GuestLoginBody),
        defaultValues: {
            name: "",
            token: "",
            tableNumber: 1,
        },
    });

    useEffect(() => {
        if (!token) {
            router.push("/");
            toast.error("Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
        }

        form.setValue("token", token);
        form.setValue("tableNumber", tableNumber);
    }, [token, tableNumber, form, router]);

    const handleLogin = useCallback(
        async (data: GuestLoginBodyType) => {
            if (isPending) return;
            try {
                const res = await loginMutate(data);
                router.push("/guest/menu");
                const { role } = res.payload.data.guest;
                setRole(role);
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        },
        [loginMutate, form, isPending, router, setRole]
    );

    const onSubmit = form.handleSubmit(handleLogin, console.warn);

    return (
        <Form {...form}>
            <form className=" flex-shrink-0 " noValidate onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Tên khách hàng</Label>
                                    <Input id="name" type="text" required {...field} />
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isPending}>
                        Đăng nhập
                    </Button>
                </div>
            </form>
        </Form>
    );
}
