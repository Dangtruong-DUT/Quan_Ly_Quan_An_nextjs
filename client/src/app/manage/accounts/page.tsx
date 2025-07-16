import AccountTable from "@/app/manage/accounts/_components/account-table";
import AccountTableProvider from "@/app/manage/accounts/context/account-table-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Suspense } from "react";

export default function AccountPage() {
    return (
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="space-y-2">
                <Card x-chunk="dashboard-06-chunk-0">
                    <CardHeader>
                        <CardTitle>Accounts</CardTitle>
                        <CardDescription>Employee Account Management</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Suspense>
                            <AccountTableProvider>
                                <AccountTable />
                            </AccountTableProvider>
                        </Suspense>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
