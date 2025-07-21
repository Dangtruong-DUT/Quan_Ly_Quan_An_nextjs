"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { useCallback } from "react";
import { toast } from "sonner";
import { ChangePasswordBody, ChangePasswordBodyType } from "@/utils/validation/account.schema";
import { useChangePasswordMutation } from "@/hooks/data/useAccount";
import { handleErrorApi } from "@/utils/handleError";
import { useTranslations } from "next-intl";

export default function ChangePasswordForm() {
    const t = useTranslations("ChangePasswordForm");
    const form = useForm<ChangePasswordBodyType>({
        resolver: zodResolver(ChangePasswordBody),
        defaultValues: {
            oldPassword: "",
            password: "",
            confirmPassword: "",
        },
    });
    const { mutateAsync: changePasswordMutate } = useChangePasswordMutation();
    const handleSubmit = useCallback(
        async (data: ChangePasswordBodyType) => {
            try {
                const res = await changePasswordMutate(data);
                toast.success(res.payload.message || t("successMessage"));
                form.reset();
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        },
        [form, changePasswordMutate, t]
    );
    const onReset = useCallback(() => {
        form.reset();
    }, [form]);
    return (
        <Form {...form}>
            <form
                noValidate
                className="grid auto-rows-max items-start gap-4 md:gap-8"
                onSubmit={form.handleSubmit(handleSubmit)}
                onReset={onReset}
            >
                <Card className="overflow-hidden" x-chunk="dashboard-07-chunk-4">
                    <CardHeader>
                        <CardTitle>{t("title")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <FormField
                                control={form.control}
                                name="oldPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-3">
                                            <Label htmlFor="oldPassword">{t("oldPassword")}</Label>
                                            <Input id="oldPassword" type="password" className="w-full" {...field} />
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
                                        <div className="grid gap-3">
                                            <Label htmlFor="password">{t("newPassword")}</Label>
                                            <Input id="password" type="password" className="w-full" {...field} />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="grid gap-3">
                                            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                                            <Input id="confirmPassword" type="password" className="w-full" {...field} />
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <div className=" items-center gap-2 md:ml-auto flex">
                                <Button variant="outline" size="sm" type="reset">
                                    {t("cancel")}
                                </Button>
                                <Button size="sm" type="submit">
                                    {t("save")}
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </Form>
    );
}
