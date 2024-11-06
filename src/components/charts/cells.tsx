"use client";

import { useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Snapshot } from "@prisma/client";
import { capitalise } from "../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const chartConfig = {
  temperature: {
    label: "Temperature",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function CellsChart({
  chartData,
  timespan,
}: {
  chartData: Snapshot[];
  timespan: number;
}) {
  const [selectedGraph, setSelectedGraph] = useState<
    "percentage" | "chargingRate"
  >("battery");
  const [selectedUnit, setSelectedUnit] = useState<"celsius" | "fahrenheit">(
    "celsius"
  );

  const convertTemperature = (temperature: number) => {
    if (selectedUnit === "celsius") return temperature;
    return Math.round((temperature * 9) / 5 + 32);
  };

  // Filter by timespan first
  const timeFilteredData = filterInTimespan(chartData);

  // Process temperature for display
  const processedData = timeFilteredData.map((point) => ({
    ...point,
    temperature: convertTemperature(point.temperature),
  }));

  const chartMargin = { top: 0, right: 0, left: -20, bottom: 0 };

  return (
    <Dialog>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-black font-title">TEMPS</CardTitle>
          <Select
            value={selectedUnit}
            onValueChange={(value: "celsius" | "fahrenheit") =>
              setSelectedUnit(value)
            }
          >
            <SelectTrigger className="w-[60px]">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="celsius">°C</SelectItem>
              <SelectItem value="fahrenheit">°F</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <h3 className="text-sm font-medium">Battery Cells</h3>
          <DialogTrigger onClick={() => setSelectedGraph("battery")}>
            <ChartContainer className="min-h-[200px]" config={chartConfig}>
              <AreaChart
                data={processedData.filter((point) => point.type === "battery")}
                margin={chartMargin}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    });
                  }}
                />
                <YAxis dx={-10} />
                <ChartTooltip
                  content={
                    <TemperatureTooltipContent selectedUnit={selectedUnit} />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  fill="var(--color-temperature)"
                  fillOpacity={0.4}
                  stroke="var(--color-temperature)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </DialogTrigger>
          <h3 className="text-sm font-medium">Motor</h3>
          <DialogTrigger onClick={() => setSelectedGraph("motor")}>
            <ChartContainer className="min-h-[200px]" config={chartConfig}>
              <AreaChart
                data={processedData.filter((point) => point.type === "motor")}
                margin={chartMargin}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                      hour12: false,
                    });
                  }}
                />
                <YAxis dx={-10} />
                <ChartTooltip
                  content={
                    <TemperatureTooltipContent selectedUnit={selectedUnit} />
                  }
                />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  fill="var(--color-temperature)"
                  fillOpacity={0.4}
                  stroke="var(--color-temperature)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ChartContainer>
          </DialogTrigger>
        </CardContent>
      </Card>

      <DialogContent className="max-w-[50vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="font-title font-black">
              Temperature Details - {capitalise(selectedGraph)}
            </span>
          </DialogTitle>
        </DialogHeader>

        <ChartContainer className="w-full" config={chartConfig}>
          <AreaChart
            data={processedData.filter((point) => point.type === selectedGraph)}
            margin={chartMargin}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              type="category"
              allowDataOverflow
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  hour12: false,
                });
              }}
            />
            <YAxis allowDataOverflow dx={-10} />
            <ChartTooltip
              content={
                <TemperatureTooltipContent selectedUnit={selectedUnit} />
              }
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              fill="var(--color-temperature)"
              fillOpacity={0.4}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </DialogContent>
    </Dialog>
  );
}
