"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Snapshot } from "@prisma/client";
import { Copy, Share } from "lucide-react";
import { useEffect, useState } from "react";
import { RunSelect } from "./run-select";

export function ExportDialog({ data }: { data: Snapshot[] }) {
  const [copied, setCopied] = useState(false);
  const [selectedRun, setSelectedRun] = useState<number>(1);
  const [runData, setRunData] = useState<Snapshot[]>(data);

  useEffect(() => {
    const fetchRunData = async () => {
      const response = await fetch(`/api/snapshot?runId=${selectedRun}`);
      const { data } = await response.json();
      setRunData(data);
    };

    fetchRunData();
  }, [selectedRun]);

  // Save this data to a CSV file
  function saveToCSV() {
    if (runData.length === 0) return;

    const headers = Object.keys(runData[0]).join(",");
    const rows = runData.map((row) => Object.values(row).join(",")).join("\n");
    const csv = `${headers}\n${rows}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `SVP_Run_${selectedRun}_${runData[0]?.time}.csv`;
    a.click();

    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2" variant="secondary">
          <Share className="text-lg" />
          Export Data
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="font-title font-black">Export Data</span>
            <RunSelect
              selectedRun={selectedRun}
              setSelectedRun={setSelectedRun}
            />
            <Button onClick={saveToCSV} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              {copied ? "Copied!" : "Save as CSV"}
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div className="overflow-auto max-h-[70vh]">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-2 text-left">Time</th>
                <th className="p-2 text-left">Motor Temp (°C)</th>
                <th className="p-2 text-left">Battery Temp (°C)</th>
                <th className="p-2 text-left">Battery %</th>
                <th className="p-2 text-left">Tyre Pressure (PSI)</th>
                <th className="p-2 text-left">Speed (km/h)</th>
                <th className="p-2 text-left">Charge Rate (kW)</th>
              </tr>
            </thead>
            <tbody>
              {runData.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="p-2">{new Date(row.time).toLocaleString()}</td>
                  <td className="p-2">{row.motorTemperature.toFixed(1)}</td>
                  <td className="p-2">{row.batteryTemperature.toFixed(1)}</td>
                  <td className="p-2">{row.batteryPercentage.toFixed(1)}</td>
                  <td className="p-2">{row.tyrePressure.toFixed(1)}</td>
                  <td className="p-2">{row.speed.toFixed(1)}</td>
                  <td className="p-2">{row.chargeRate.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
