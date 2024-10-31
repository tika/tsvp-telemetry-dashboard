"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceArea,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

// Data is { date: string, temperature: number, type: "battery" | "motor" }[]
export function TempsChart({
  chartData,
}: {
  chartData: { date: string; temperature: number; type: "battery" | "motor" }[];
}) {
  const [selectedGraph, setSelectedGraph] = useState<"battery" | "motor">(
    "battery"
  );
  const [selectedUnit, setSelectedUnit] = useState<"celsius" | "fahrenheit">(
    "celsius"
  );
  const [left, setLeft] = useState("dataMin");
  const [right, setRight] = useState("dataMax");
  const [refAreaLeft, setRefAreaLeft] = useState("");
  const [refAreaRight, setRefAreaRight] = useState("");

  const convertTemperature = (data: typeof chartData) => {
    // First filter by type, then convert if necessary
    const filteredData = data.filter((point) => point.type === selectedGraph);

    if (selectedUnit === "celsius") return filteredData;

    return filteredData.map((point) => ({
      ...point,
      temperature: Math.round((point.temperature * 9) / 5 + 32),
    }));
  };

  const processedData = convertTemperature(chartData);

  const zoom = () => {
    if (refAreaLeft === refAreaRight || refAreaRight === "") {
      setRefAreaLeft("");
      setRefAreaRight("");
      return;
    }

    // xAxis domain
    if (refAreaLeft > refAreaRight) {
      setLeft(refAreaRight);
      setRight(refAreaLeft);
    } else {
      setLeft(refAreaLeft);
      setRight(refAreaRight);
    }

    setRefAreaLeft("");
    setRefAreaRight("");
  };

  const zoomOut = () => {
    setLeft("dataMin");
    setRight("dataMax");
  };

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
                data={chartData.filter((point) => point.type === "battery")}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  fill="var(--color-temperature)"
                  fillOpacity={0.4}
                  stroke="var(--color-temperature)"
                />
              </AreaChart>
            </ChartContainer>
          </DialogTrigger>
          <h3 className="text-sm font-medium">Motor</h3>
          <DialogTrigger onClick={() => setSelectedGraph("motor")}>
            <ChartContainer className="min-h-[200px]" config={chartConfig}>
              <AreaChart
                data={chartData.filter((point) => point.type === "motor")}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
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
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="temperature"
                  fill="var(--color-temperature)"
                  fillOpacity={0.4}
                  stroke="var(--color-temperature)"
                />
              </AreaChart>
            </ChartContainer>
          </DialogTrigger>
        </CardContent>
      </Card>

      <DialogContent className="w-full max-w-4xl h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Temperature Details - {selectedGraph}</span>
            <button
              onClick={zoomOut}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-secondary"
            >
              Reset Zoom
            </button>
          </DialogTitle>
        </DialogHeader>

        <ChartContainer className="h-[500px]" config={chartConfig}>
          <AreaChart
            data={processedData}
            onMouseDown={(e) => e && setRefAreaLeft(e.activeLabel as string)}
            onMouseMove={(e) =>
              refAreaLeft && e && setRefAreaRight(e.activeLabel as string)
            }
            onMouseUp={zoom}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              domain={[left, right]}
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
            <YAxis allowDataOverflow />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="var(--color-temperature)"
              fill="var(--color-temperature)"
              fillOpacity={0.4}
            />
            {refAreaLeft && refAreaRight ? (
              <ReferenceArea
                x1={refAreaLeft}
                x2={refAreaRight}
                strokeOpacity={0.3}
              />
            ) : null}
          </AreaChart>
        </ChartContainer>
      </DialogContent>
    </Dialog>
  );
}
