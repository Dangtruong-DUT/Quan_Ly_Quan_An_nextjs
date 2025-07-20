import OrderTable from "@/app/[locale]/manage/orders/_components/order-table/order-table";
import OrderTableProvider from "@/app/[locale]/manage/orders/context/order-table-provider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Suspense } from "react";

export default function AccountsPage() {
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Đơn hàng</CardTitle>
                        <CardDescription>Quản lý đơn hàng</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense>
                            <OrderTableProvider>
                                <OrderTable />
                            </OrderTableProvider>
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
