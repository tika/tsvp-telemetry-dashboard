"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Speed",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "January", speed: 60 },
  { month: "February", speed: 70 },
  { month: "March", speed: 80 },
  { month: "April", speed: 90 },
  { month: "May", speed: 100 },
  { month: "June", speed: 110 },
];

export function SpeedChart() {
  return (
    <Card>
      <CardHeader className="my-4">
        <CardTitle className="font-title font-black">SPEED</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Speed Over Time</h3>
        <ChartContainer className="min-h-32" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
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
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="speed"
              type="natural"
              fill="var(--color-desktop)"
              fillOpacity={0.4}
              stroke="var(--color-desktop)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
