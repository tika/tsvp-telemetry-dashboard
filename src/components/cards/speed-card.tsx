import {
  SnapshotWithTimeString,
  TelemetryChart,
} from "../telemetry-chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function SpeedCard({
  data,
  timespan,
}: {
  data: SnapshotWithTimeString[];
  timespan: number;
}) {
  const color = "hsl(var(--chart-4))";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-black font-title">SPEED</CardTitle>
      </CardHeader>
      <CardContent>
        <TelemetryChart
          chartData={data}
          timespan={timespan}
          tooltipFunction={(val) => `${val}km/h`}
          dataKey="speed"
          color={color}
          processData={(value) => Math.round(value * 100) / 100} // 2 decimal places
          chartTitle="Speed"
          dialogTitle="Speed Details"
          label="Speed"
        />
      </CardContent>
    </Card>
  );
}
