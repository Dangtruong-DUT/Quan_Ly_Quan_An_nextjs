"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "@/app/queries/useAuth";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/app-provider";
import { useCallback } from "react";

export default function LoginForm() {
    const { setIsAuthenticated } = useAppContext();
    const router = useRouter();
    const { mutateAsync: login, isPending } = useLoginMutation();
    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            email: "",
            password: "",
        },
    });
    const onSubmit = useCallback(
        async (data: LoginBodyType) => {
            if (isPending) return;
            try {
                const res = await login(data);
                toast.success(res.payload.message);
                setIsAuthenticated(true);
                router.push("/manage/dashboard");
                router.refresh();
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        },
        [form, isPending, login, router, setIsAuthenticated]
    );
    return (
        <Card className=" max-w-md w-full">
            <CardHeader>
                <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                <CardDescription>Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
                        noValidate
                        onSubmit={form.handleSubmit(onSubmit, console.warn)}
                    >
                        <div className="grid gap-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                placeholder="m@example.com"
                                                required
                                                {...field}
                                            />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-2">
                                            <div className="flex items-center">
                                                <Label htmlFor="password">Password</Label>
                                            </div>
                                            <Input id="password" type="password" required {...field} />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isPending}>
                                Đăng nhập
                            </Button>
                            <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                                Đăng nhập bằng Google
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
