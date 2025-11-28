import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { PopularDocument } from "../services/adminDashboardService";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import { FileText } from "lucide-react";

interface PopularDocumentsChartProps {
  documents: PopularDocument[];
  isLoading?: boolean;
}

const chartConfig = {
  count: {
    label: "Requests",
    color: "rgb(16, 185, 129)", // emerald-500
  },
} satisfies ChartConfig;

export function PopularDocumentsChart({ documents, isLoading }: PopularDocumentsChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Popular Documents</CardTitle>
          <CardDescription>Most requested document types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-4 w-1/3 bg-gray-200 rounded" />
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </div>
                <div className="h-2 w-full bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-muted/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Popular Documents</CardTitle>
        <CardDescription className="text-sm">
          Most requested document types
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <FileText className="h-12 w-12 text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No document requests yet</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[320px] w-full">
            <BarChart
              data={documents}
              layout="vertical"
              margin={{
                left: 0,
                right: 32,
                top: 5,
                bottom: 5,
              }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="documentType"
                type="category"
                tickLine={false}
                axisLine={false}
                width={140}
                tick={{ fontSize: 12 }}
                className="text-muted-foreground"
                tickFormatter={(value) => {
                  if (value.length > 18) {
                    return value.slice(0, 18) + "...";
                  }
                  return value;
                }}
              />
              <ChartTooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="min-w-[200px]"
                    formatter={(value, name, item) => (
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-foreground">
                          {item.payload.documentType}
                        </span>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-foreground">{value} requests</span>
                          <span className="text-muted-foreground">
                            ({item.payload.percentage}%)
                          </span>
                        </div>
                      </div>
                    )}
                  />
                }
              />
              <Bar
                dataKey="count"
                fill="var(--color-count)"
                radius={[0, 6, 6, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
