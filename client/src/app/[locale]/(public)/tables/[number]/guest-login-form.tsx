"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GuestLoginBody, GuestLoginBodyType } from "@/utils/validation/guest.schema";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { handleErrorApi } from "@/utils/handleError";
import { useGuestLoginMutation } from "@/hooks/data/useGuest";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { useAppStore } from "@/providers/app-provider";
import { SearchParamsLoader, useSearchParamsLoader } from "@/components/searchparams-loader";
import { useTranslations } from "next-intl";

export default function GuestLoginForm() {
    const t = useTranslations("GuestLoginPage");
    const { searchParams, setSearchParams } = useSearchParamsLoader();
    const params = useParams<{ number: string }>();
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
        const token = searchParams?.get("token") || "";
        if (!token) {
            toast.error(t("tokenInvalid"));
        }
        form.setValue("token", token);
        form.setValue("tableNumber", tableNumber);
    }, [searchParams, tableNumber, form, router, t]);

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
            <SearchParamsLoader onParamsReceived={setSearchParams} />
            <form className=" flex-shrink-0 " noValidate onSubmit={onSubmit}>
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">{t("nameLabel")}</Label>
                                    <Input id="name" type="text" required {...field} />
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="w-full" disabled={isPending}>
                        {t("loginButton")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
