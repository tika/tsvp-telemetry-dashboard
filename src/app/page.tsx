"use server";

import logo from "@/app/logo.svg";
import { prisma } from "@/lib/db";
import { Snapshot } from "@prisma/client";
import { FileText } from "lucide-react";
import Image from "next/image";
import { CellsChart } from "../components/charts/cells";
import { SpeedChart } from "../components/charts/speed";
import { TempsChart } from "../components/charts/temps";
import { TyrePressureChart } from "../components/charts/tyre-pressure";
import { ExportDialog } from "../components/export-dialog";
import { RunSelect } from "../components/run-select";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

type TemperatureChartData = {
  date: string;
  temperature: number;
  type: "battery" | "motor";
}[];

async function getData(): Promise<Snapshot[]> {
  const snapshots = await prisma.snapshot.findMany({
    orderBy: {
      time: "desc",
    },
    take: 100, // Limit to last 100 readings
  });

  return snapshots;
}

export default async function Dashboard() {
  const snapshots = await getData();
  const temperatureChartData: TemperatureChartData = snapshots
    .map((snapshot) => [
      {
        date: snapshot.time.toISOString(),
        temperature: snapshot.motorTemperature,
        type: "motor" as const,
      },
      {
        date: snapshot.time.toISOString(),
        temperature: snapshot.batteryTemperature,
        type: "battery" as const,
      },
    ])
    .flat();

  return (
    <div className="my-4 mx-16 flex flex-col gap-4">
      <div className="flex justify-between">
        <Image src={logo} alt="logo" width={150} height={150} />
        <RunSelect />
        <div className="flex items-center gap-4">
          <p className="text-sm">Graphs Show: </p>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={"Select Graph Timespan"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last 1 min</SelectItem>
              <SelectItem value="5m">Last 5 mins</SelectItem>
              <SelectItem value="10m">Last 10 mins</SelectItem>
              <SelectItem value="30m">Last 30 mins</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <p className="uppercase font-black text-[10px] font-title text-gray-400">
            Viewing Date
          </p>
          <p className="text-lg font-bold">25 September 2024</p>
          <p>Last updated at 13:22:12</p>
        </div>
        <div className="flex gap-2">
          <Button size="icon">
            <FileText />
          </Button>
          <ExportDialog data={snapshots} />
        </div>
      </div>

      <div className="flex gap-4">
        <TempsChart chartData={temperatureChartData} timespan={0.5} />
        <CellsChart />
        <div className="flex gap-4">
          <TyrePressureChart />
          <SpeedChart />
        </div>
      </div>
    </div>
  );
}
