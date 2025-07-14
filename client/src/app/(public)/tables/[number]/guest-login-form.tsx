"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuestLoginBody, GuestLoginBodyType } from "@/utils/validation/guest.schema";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function GuestLoginForm() {
    const searchParams = useSearchParams();
    const params = useParams<{ number: string }>();
    const token = searchParams.get("token") || "";
    const tableNumber = Number(params.number);

    const form = useForm<GuestLoginBodyType>({
        resolver: zodResolver(GuestLoginBody),
        defaultValues: {
            name: "",
            token: "",
            tableNumber: 1,
        },
    });

    useEffect(() => {
        form.setValue("token", token);
        form.setValue("tableNumber", tableNumber);
    }, [token, tableNumber, form]);

    return (
        <Form {...form}>
            <form className=" flex-shrink-0 " noValidate>
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

                    <Button type="submit" className="w-full">
                        Đăng nhập
                    </Button>
                </div>
            </form>
        </Form>
    );
}
