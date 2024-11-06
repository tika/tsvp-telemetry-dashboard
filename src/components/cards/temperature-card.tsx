import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useState } from "react";
import { SnapshotWithTimeString, TelemetryChart } from "../telemetry-chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function TemperatureCard({
  data,
  timespan,
}: {
  data: SnapshotWithTimeString[];
  timespan: number;
}) {
  const [selectedUnit, setSelectedUnit] = useState<"celsius" | "fahrenheit">(
    "celsius"
  );

  const convertTemperature = (temperature: number) => {
    if (selectedUnit === "celsius") return Math.round(temperature);
    return Math.round((temperature * 9) / 5 + 32);
  };

  const tooltipFunction = (val: number) =>
    `${val}°${selectedUnit === "celsius" ? "C" : "F"}`;

  const color = "hsl(var(--chart-1))";

  return (
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
      <CardContent>
        <TelemetryChart
          chartData={data}
          timespan={timespan}
          tooltipFunction={tooltipFunction}
          dataKey="batteryTemperature"
          color={color}
          processData={(value) => convertTemperature(value)}
          chartTitle="Battery Cells"
          dialogTitle="Battery Cells Temperature Details"
          label="Temperature"
        />
        <TelemetryChart
          chartData={data}
          timespan={timespan}
          tooltipFunction={tooltipFunction}
          dataKey="motorTemperature"
          color={color}
          processData={(value) => convertTemperature(value)}
          chartTitle="Motor"
          dialogTitle="Motor Temperature Details"
          label="Temperature"
        />
      </CardContent>
    </Card>
  );
}
