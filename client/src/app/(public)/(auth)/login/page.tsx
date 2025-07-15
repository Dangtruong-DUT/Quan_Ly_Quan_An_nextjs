import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import LoginForm from "@/app/(public)/(auth)/login/login-form";
import { Suspense } from "react";

export default function Login() {
    return (
        <div>
            <Card className=" mx-auto max-w-md w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Đăng nhập</CardTitle>
                    <CardDescription>Nhập email và mật khẩu của bạn để đăng nhập vào hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                    <Suspense>
                        <LoginForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
