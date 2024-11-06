import { SnapshotWithTimeString, TelemetryChart } from "../telemetry-chart";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export function TyrePressureCard({
  data,
  timespan,
}: {
  data: SnapshotWithTimeString[];
  timespan: number;
}) {
  const color = "hsl(var(--chart-3))";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="font-black font-title">TYRE PRESSURE</CardTitle>
      </CardHeader>
      <CardContent>
        <TelemetryChart
          chartData={data}
          timespan={timespan}
          tooltipFunction={(val) => `${val}psi`}
          dataKey="tyrePressure"
          color={color}
          processData={(value) => Math.round(value * 100) / 100} // 2 decimal places
          chartTitle="Tyre Pressure"
          dialogTitle="Tyre Pressure Details"
          label="Pressure"
        />
      </CardContent>
    </Card>
  );
}
