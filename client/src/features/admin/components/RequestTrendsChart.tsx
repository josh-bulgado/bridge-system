import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { RequestTrendData } from "../services/adminDashboardService";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { TrendingUp } from "lucide-react";

interface RequestTrendsChartProps {
  trends: RequestTrendData[];
  isLoading?: boolean;
}

const chartConfig = {
  count: {
    label: "Requests",
    color: "rgb(34, 197, 94)", // green-500
  },
} satisfies ChartConfig;

export function RequestTrendsChart({ trends, isLoading }: RequestTrendsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request Trends</CardTitle>
          <CardDescription>Document requests over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Trends</CardTitle>
        <CardDescription>Document requests over the last 6 months</CardDescription>
      </CardHeader>
      <CardContent>
        {trends.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <TrendingUp className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-sm text-muted-foreground">No trend data available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart
              data={trends}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="count"
                type="monotone"
                fill="url(#fillCount)"
                fillOpacity={0.4}
                stroke="var(--color-count)"
                strokeWidth={2}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
