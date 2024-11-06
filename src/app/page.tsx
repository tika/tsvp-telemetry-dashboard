"use client";

import logo from "@/app/logo.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { CellsCard } from "../components/cards/cells-card";
import { SpeedCard } from "../components/cards/speed-card";
import { TemperatureCard } from "../components/cards/temperature-card";
import { TyrePressureCard } from "../components/cards/tyre-pressure-card";
import { ExportDialog } from "../components/export-dialog";
import { RunSelect } from "../components/run-select";
import { SnapshotWithTimeString } from "../components/telemetry-chart";
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

type CellsChartData = {
  date: string;
  value: number;
  type: "percentage" | "chargingRate";
}[];

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

function getCellsChartData(snapshots: SnapshotWithTimeString[]) {
  const cellsChartData: CellsChartData = snapshots
    .map((snapshot) => [
      {
        date: snapshot.time,
        value: snapshot.batteryPercentage,
        type: "percentage" as const,
      },
      {
        date: snapshot.time,
        value: snapshot.chargeRate,
        type: "chargingRate" as const,
      },
    ])
    .flat();

  return cellsChartData;
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
  const [data, setData] = useState<SnapshotWithTimeString[]>([]);
  const [timespan, setTimespan] = useState<string>("1m");
  const [selectedRun, setSelectedRun] = useState<number>(1);
  const [runDate, setRunDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/snapshot?runId=${selectedRun}`);
      const { data } = await response.json();

      if (data.length > 0) {
        setRunDate(new Date(data[0].time));
      }

      setData(data);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [selectedRun]);

  function formatDate(date: Date | null) {
    if (!date) return "Loading...";
    // Format: 25 October 2024
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatTime(date: Date | null) {
    if (!date) return "Loading...";
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    });
  }

  return (
    <div className="my-4 mx-16 flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <Image src={logo} alt="logo" width={150} height={150} />
        <div className="flex flex-col gap-4 items-end">
          <RunSelect
            selectedRun={selectedRun}
            setSelectedRun={setSelectedRun}
          />
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm">Graphs Show: </p>
          <Select
            onValueChange={(value) => setTimespan(value)}
            value={timespan}
          >
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
          <p className="text-lg font-bold">
            {runDate ? formatDate(runDate) : "No data"}
          </p>
          <p>Last updated at {runDate ? formatTime(runDate) : "Never"}</p>
        </div>
        <div className="flex gap-2">
          <ExportDialog data={data} />
        </div>
      </div>

      <div className="flex gap-4 flex-wrap justify-evenly">
        <TemperatureCard
          data={data}
          timespan={convertTimespanToMinutes(timespan)}
        />
        <CellsCard data={data} timespan={convertTimespanToMinutes(timespan)} />
        <TyrePressureCard
          data={data}
          timespan={convertTimespanToMinutes(timespan)}
        />
        <SpeedCard data={data} timespan={convertTimespanToMinutes(timespan)} />
      </div>
    </div>
  );
}
