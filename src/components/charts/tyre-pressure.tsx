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
    label: "Tyre Pressure",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const chartData = [
  { month: "January", pressure: 32 },
  { month: "February", pressure: 30 },
  { month: "March", pressure: 34 },
  { month: "April", pressure: 31 },
  { month: "May", pressure: 33 },
  { month: "June", pressure: 35 },
];

export function TyrePressureChart() {
  return (
    <Card>
      <CardHeader className="my-4">
        <CardTitle className="font-title font-black">TYRE PRESSURE</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Pressure (psi)</h3>
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
              dataKey="pressure"
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
