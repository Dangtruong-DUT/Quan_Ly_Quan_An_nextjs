"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RevenueLineChart } from "@/app/manage/dashboard/revenue-line-chart";
import { DishBarChart } from "@/app/manage/dashboard/dish-bar-chart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, CreditCard, Activity } from "lucide-react"; // 🎯 Lucide icons

export default function DashboardMain() {
    const resetDateFilter = () => {};

    return (
        <div className="space-y-4">
            {/* Bộ lọc thời gian */}
            <div className="flex flex-wrap gap-2">
                <div className="flex items-center">
                    <span className="mr-2">Từ</span>
                    <Input type="datetime-local" placeholder="Từ ngày" className="text-sm" />
                </div>
                <div className="flex items-center">
                    <span className="mr-2">Đến</span>
                    <Input type="datetime-local" placeholder="Đến ngày" />
                </div>
                <Button variant="outline" onClick={resetDateFilter}>
                    Reset
                </Button>
            </div>

            {/* Thống kê ngắn */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Khách</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Gọi món</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Đơn hàng</CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground">Đã thanh toán</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bàn đang phục vụ</CardTitle>
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
                    <RevenueLineChart />
                </div>
                <div className="lg:col-span-3">
                    <DishBarChart />
                </div>
            </div>
        </div>
    );
}
