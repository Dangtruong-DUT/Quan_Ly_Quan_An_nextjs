"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react";
import { endOfDay, startOfDay } from "date-fns";
import { useCallback, useState } from "react";
import { formatDateTimeLocal } from "@/utils/formatting/formatTime";
import { useDashboardIndicator } from "@/hooks/data/useIndicator";
import { formatCurrency } from "@/utils/formatting/formatCurrency";
import { formatNumberWithSuffix } from "@/utils/formatting/formatNum";
import { RevenueLineChart } from "@/app/[locale]/manage/dashboard/revenue-line-chart";
import { DishBarChart } from "@/app/[locale]/manage/dashboard/dish-bar-chart";
import { useTranslations } from "next-intl";

const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());
export default function DashboardMain() {
    const t = useTranslations("DashboardMain");
    const [fromDate, setFromDate] = useState(initFromDate);
    const [toDate, setToDate] = useState(initToDate);
    const resetDateFilter = useCallback(() => {
        setFromDate(initFromDate);
        setToDate(initToDate);
    }, []);

    const { data: dashboardData } = useDashboardIndicator({
        fromDate,
        toDate,
    });
    const { revenue, orderCount, guestCount, revenueByDate, dishIndicator } = dashboardData?.payload.data || {};
    return (
        <div className="space-y-4">
            {/* Bộ lọc thời gian */}
            <div className="flex flex-wrap gap-2">
                <div className="flex items-center">
                    <span className="mr-2">{t("from")}</span>
                    <Input
                        type="datetime-local"
                        placeholder={t("fromDatePlaceholder")}
                        className="text-sm"
                        value={formatDateTimeLocal(fromDate)}
                        onChange={(event) => setFromDate(new Date(event.target.value))}
                    />
                </div>
                <div className="flex items-center">
                    <span className="mr-2">{t("to")}</span>
                    <Input
                        type="datetime-local"
                        placeholder={t("toDatePlaceholder")}
                        className="text-sm"
                        value={formatDateTimeLocal(toDate)}
                        onChange={(event) => setToDate(new Date(event.target.value))}
                    />
                </div>
                <Button variant="outline" onClick={resetDateFilter}>
                    {t("resetButton")}
                </Button>
            </div>

            {/* Thống kê ngắn */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("totalRevenue")}</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(revenue || 0)}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("customers")}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumberWithSuffix(guestCount || 0)}</div>
                        <p className="text-xs text-muted-foreground">{t("customerOrders")}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("orders")}</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatNumberWithSuffix(orderCount || 0)}</div>
                        <p className="text-xs text-muted-foreground">{t("paidOrders")}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{t("servingTables")}</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>
            </div>

            {/* Biểu đồ */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="lg:col-span-4">
                    <RevenueLineChart chartData={revenueByDate} />
                </div>
                <div className="lg:col-span-3">
                    <DishBarChart chartData={dishIndicator} />
                </div>
            </div>
        </div>
    );
}
