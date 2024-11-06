// A chart component that allows you to click on it and see it in a full screen dialog

import { Snapshot } from "@prisma/client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartConfig, ChartContainer, ChartTooltip } from "../ui/chart";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type SnapshotWithTimeString = Snapshot & {
  time: string;
};

// Add this type to help with tooltip formatting
type TemperatureTooltipProps = {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  contentFn: (value: number) => string;
};

// A tooltip component that allows you to pass in a function to style the content
// By default, it just shows the value
function TooltipContent({
  active,
  payload,
  contentFn,
}: TemperatureTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <div className="flex items-center gap-2">
        <div className="flex h-2 w-2 rounded-full bg-[var(--color-temperature)]" />
        <span className="font-medium">{contentFn(payload[0].value)}</span>
      </div>
    </div>
  );
}

export function TelemetryChart({
  chartData,
  timespan,
  tooltipFunction,
  dataKey,
  color,
  label,
  processData = (value: number) => value,
  chartTitle,
  dialogTitle,
}: {
  chartData: SnapshotWithTimeString[];
  timespan: number; // in minutes
  tooltipFunction: (value: number) => string;
  dataKey: string;
  color: string;
  label: string;
  processData?: (value: number) => number;
  chartTitle: string;
  dialogTitle: string;
}) {
  const chartConfig = {
    temperature: {
      label: label, // This is the label that will be shown in the tooltip
      color: color,
    },
  } satisfies ChartConfig;

  function filterInTimespan(data: typeof chartData) {
    if (data.length === 0) return data;

    const latestTime = Math.max(
      ...data.map((point) => new Date(point.time).getTime())
    );
    const earliestTime = latestTime - timespan * 60 * 1000;

    return data.filter(
      (point) => new Date(point.time).getTime() >= earliestTime
    );
  }

  // Filter by timespan first
  const timeFilteredData = filterInTimespan(chartData);

  // Process the data using the processor function
  const processedData = timeFilteredData.map((point) => ({
    ...point,
    [dataKey]: processData(point[dataKey as keyof typeof point] as number),
  }));

  const chartMargin = { top: 0, right: 0, left: -20, bottom: 0 };

  return (
    <Dialog>
      <div className="flex flex-col gap-2">
        <p>{chartTitle}</p>
        <DialogTrigger>
          <ChartContainer className="min-h-[200px]" config={chartConfig}>
            <AreaChart data={processedData} margin={chartMargin}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
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
                content={<TooltipContent contentFn={tooltipFunction} />}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                fill={color}
                fillOpacity={0.4}
                stroke={color}
                isAnimationActive={false}
              />
            </AreaChart>
          </ChartContainer>
        </DialogTrigger>
      </div>

      <DialogContent className="max-w-[50vw]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="font-title font-black">{dialogTitle}</span>
          </DialogTitle>
        </DialogHeader>

        <ChartContainer className="w-full" config={chartConfig}>
          <AreaChart data={processedData} margin={chartMargin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="time"
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
              content={<TooltipContent contentFn={tooltipFunction} />}
            />
            <Area
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              fill={color}
              fillOpacity={0.4}
              isAnimationActive={false}
            />
          </AreaChart>
        </ChartContainer>
      </DialogContent>
    </Dialog>
  );
}
