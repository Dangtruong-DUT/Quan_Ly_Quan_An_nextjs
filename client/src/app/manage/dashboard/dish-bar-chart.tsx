"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { DashboardIndicatorResType } from "@/utils/validation/indicator.schema";

const colors = [
    "var(--color-chrome)",
    "var(--color-safari)",
    "var(--color-firefox)",
    "var(--color-edge)",
    "var(--color-other)",
];

const chartConfig = {
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Firefox",
        color: "var(--chart-3)",
    },
    edge: {
        label: "Edge",
        color: "var(--chart-4)",
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig;
export function DishBarChart({
    chartData,
}: {
    chartData?: Pick<DashboardIndicatorResType["data"]["dishIndicator"][number], "name" | "successOrders">[];
}) {
    chartData = chartData || [];
    chartData = chartData.map((item, index) => ({
        ...item,
        fill: colors[index % colors.length],
    }));
    return (
        <Card>
            <CardHeader>
                <CardTitle>Xếp hạng món ăn</CardTitle>
                <CardDescription>Được gọi nhiều nhất</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            left: 0,
                        }}
                    >
                        <YAxis
                            dataKey="name"
                            type="category"
                            tickLine={false}
                            tickMargin={2}
                            axisLine={false}
                            tickFormatter={(value) => {
                                return value;
                            }}
                        />
                        <XAxis dataKey="successOrders" type="number" hide />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <Bar dataKey="successOrders" name={"Đơn thanh toán :"} layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm"></CardFooter>
        </Card>
    );
}
