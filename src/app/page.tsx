"use client";

import logo from "@/app/logo.svg";
import { FileText, Share } from "lucide-react";
import Image from "next/image";
import { CellsChart } from "../components/charts/cells";
import { SpeedChart } from "../components/charts/speed";
import { TempsChart } from "../components/charts/temps";
import { TyrePressureChart } from "../components/charts/tyre-pressure";
import { RunSelect } from "../components/run-select";
import { Button } from "../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

export default function Dashboard() {
  return (
    <div className="my-4 mx-16 flex flex-col gap-4">
      <div className="flex justify-between">
        <Image src={logo} alt="logo" width={150} height={150} />
        <RunSelect />
        <div className="flex items-center gap-4">
          <p className="text-sm">Graphs Show: </p>
          <Select>
            <SelectTrigger className="w-40">
              <SelectValue placeholder={"Select Time"} />
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
          <Button className="gap-2" variant="secondary">
            <Share className="text-lg" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="flex gap-4">
        <TempsChart />
        <CellsChart />
        <div className="flex gap-4">
          <TyrePressureChart />
          <SpeedChart />
        </div>
      </div>
    </div>
  );
}
