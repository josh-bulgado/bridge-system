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
    <Card>
      <CardHeader>
        <CardTitle>Popular Documents</CardTitle>
        <CardDescription>Most requested document types</CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mb-3" />
            <p className="text-sm text-muted-foreground">No document requests yet</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <BarChart
              data={documents}
              layout="vertical"
              margin={{
                left: 0,
                right: 16,
                top: 0,
                bottom: 0,
              }}
            >
              <XAxis type="number" hide />
              <YAxis
                dataKey="documentType"
                type="category"
                tickLine={false}
                axisLine={false}
                width={120}
                tickFormatter={(value) => value.length > 15 ? value.slice(0, 15) + "..." : value}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name, item) => (
                      <div className="flex items-center gap-2">
                        <div className="flex flex-col">
                          <span className="font-medium">{item.payload.documentType}</span>
                          <span className="text-muted-foreground">
                            {value} requests ({item.payload.percentage}%)
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
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
