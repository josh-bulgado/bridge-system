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
    <Card className="border-muted/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Request Trends</CardTitle>
        <CardDescription className="text-sm">
          Document requests over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        {trends.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[320px] text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No trend data available</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <AreaChart
              data={trends}
              margin={{
                left: 12,
                right: 12,
                top: 12,
                bottom: 12,
              }}
            >
              <CartesianGrid 
                vertical={false} 
                strokeDasharray="3 3"
                className="stroke-muted/30"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                width={40}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <defs>
                <linearGradient id="fillCount" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="count"
                type="monotone"
                fill="url(#fillCount)"
                fillOpacity={1}
                stroke="var(--color-count)"
                strokeWidth={2.5}
                dot={{
                  fill: "var(--color-count)",
                  strokeWidth: 2,
                  r: 4,
                  strokeDasharray: "",
                }}
                activeDot={{
                  r: 6,
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
