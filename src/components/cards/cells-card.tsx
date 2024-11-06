import { SnapshotWithTimeString, TelemetryChart } from "../telemetry-chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function CellsCard({
  data,
  timespan,
}: {
  data: SnapshotWithTimeString[];
  timespan: number;
}) {
  const color = "hsl(var(--chart-2))";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-black font-title">CELLS</CardTitle>
      </CardHeader>
      <CardContent>
        <TelemetryChart
          chartData={data}
          timespan={timespan}
          tooltipFunction={(val) => `${val}%`}
          dataKey="batteryPercentage"
          color={color}
          processData={(value) => Math.round(value * 100) / 100} // 2 decimal places
          chartTitle="Cells Percentage"
          dialogTitle="Cells Percentage Details"
          label="Percentage"
        />
        <TelemetryChart
          chartData={data}
          timespan={timespan}
          tooltipFunction={(val) => `${val}A`}
          dataKey="chargeRate"
          color={color}
          processData={(value) => Math.round(value * 100) / 100} // 2 decimal places
          chartTitle="Charging Rate"
          dialogTitle="Charging Rate Details"
          label="Charging Rate"
        />
      </CardContent>
    </Card>
  );
}
