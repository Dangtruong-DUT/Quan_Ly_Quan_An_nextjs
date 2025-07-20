import GuestLoginForm from "@/app/[locale]/(public)/tables/[number]/guest-login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";

export default function TableNumberPage() {
    return (
        <div>
            <Card className="mx-auto  max-w-[300px]  sm:max-w-[600px] space-y-2 w-full">
                <CardHeader>
                    <CardTitle className="text-2xl">Đăng nhập gọi món</CardTitle>
                </CardHeader>
                <CardContent>
                    <Suspense>
                        <GuestLoginForm />
                    </Suspense>
                </CardContent>
            </Card>
        </div>
    );
}
