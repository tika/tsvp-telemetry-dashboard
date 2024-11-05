"use client";

import logo from "@/app/logo.svg";
import { Snapshot } from "@prisma/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { TempsChart } from "../components/charts/temps";
import { ExportDialog } from "../components/export-dialog";
import { RunSelect } from "../components/run-select";
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

type SnapshotWithTimeString = Snapshot & {
  time: string;
};

function getTemperatureChartData(snapshots: SnapshotWithTimeString[]) {
  const temperatureChartData: TemperatureChartData = snapshots
    .map((snapshot) => [
      {
        date: snapshot.time,
        temperature: snapshot.motorTemperature,
        type: "motor" as const,
      },
      {
        date: snapshot.time,
        temperature: snapshot.batteryTemperature,
        type: "battery" as const,
      },
    ])
    .flat();

  return temperatureChartData;
}

function convertTimespanToMinutes(timespan: string) {
  if (timespan === "1m") return 1;
  if (timespan === "5m") return 5;
  if (timespan === "10m") return 10;
  if (timespan === "30m") return 30;

  return 1;
}

export default function Dashboard() {
  // use effect
  const [data, setData] = useState<Snapshot[]>([]);
  const [temperatureChartData, setTemperatureChartData] =
    useState<TemperatureChartData>([]);
  const [timespan, setTimespan] = useState<string>("1m");
  const [selectedRun, setSelectedRun] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/snapshot?runId=${selectedRun}`);
      const { data } = await response.json();

      setData(data);

      console.log(data);
      setTemperatureChartData(getTemperatureChartData(data));
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [selectedRun]);

  return (
    <div className="my-4 mx-16 flex flex-col gap-4">
      <div className="flex justify-between">
        <Image src={logo} alt="logo" width={150} height={150} />
        <RunSelect selectedRun={selectedRun} setSelectedRun={setSelectedRun} />
        <div className="flex items-center gap-4">
          <p className="text-sm">Graphs Show: </p>
          <Select onValueChange={(value) => setTimespan(value)}>
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
          <ExportDialog data={data} />
        </div>
      </div>

      <div className="flex gap-4">
        <TempsChart
          chartData={temperatureChartData}
          timespan={convertTimespanToMinutes(timespan)}
        />
        <div className="flex gap-4">
          {/* <TyrePressureChart data={data} timespan={convertTimespanToMinutes(timespan)} /> */}
        </div>
      </div>
    </div>
  );
}
