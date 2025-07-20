"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCallback, useEffect } from "react";
import { useLoginMutation } from "@/hooks/data/useAuth";
import { LoginBody, LoginBodyType } from "@/utils/validation/auth.schema";
import { handleErrorApi } from "@/utils/handleError";
import { clientSessionToken } from "@/services/storage/clientSessionToken";
import { getOauthGoogleUrl } from "@/helpers/oauth";
import { Link, useRouter } from "@/i18n/navigation";
import { useAppStore } from "@/providers/app-provider";
import { SearchParamsLoader, useSearchParamsLoader } from "@/components/searchparams-loader";
import { useTranslations } from "next-intl";

export default function LoginForm() {
    const t = useTranslations("LoginPage");
    const { searchParams, setSearchParams } = useSearchParamsLoader();

    useEffect(() => {
        const clearToken = searchParams?.get("clearToken") === "true";
        if (clearToken) {
            clientSessionToken.clear();
        }
    }, [searchParams]);

    const setRole = useAppStore((state) => state.setRole);
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
                const role = res.payload.data.account.role;
                setRole(role);
                router.push("/manage/dashboard");
                toast.success(res.payload.message);

                router.refresh();
            } catch (error) {
                handleErrorApi(error, form.setError);
            }
        },
        [form, isPending, login, router, setRole]
    );

    const googleOauthUrl = getOauthGoogleUrl();

    return (
        <Form {...form}>
            <SearchParamsLoader onParamsReceived={setSearchParams} />
            <form
                className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
                noValidate
                method="post"
                onSubmit={form.handleSubmit(onSubmit, console.warn)}
            >
                <div className="grid gap-4">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">{t("emailLabel")}</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder={t("emailPlaceholder")}
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
                                        <Label htmlFor="password">{t("passwordLabel")}</Label>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder={t("passwordPlaceholder")}
                                        required
                                        {...field}
                                    />
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isPending}>
                        {t("loginButton")}
                    </Button>
                    <Link href={googleOauthUrl} className="w-full">
                        <Button variant="outline" className="w-full" type="button" disabled={isPending}>
                            {t("googleLoginButton")}
                        </Button>
                    </Link>
                </div>
            </form>
        </Form>
    );
}
