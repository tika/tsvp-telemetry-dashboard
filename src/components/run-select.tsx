"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function RunSelect({
  selectedRun,
  setSelectedRun,
}: {
  selectedRun?: number;
  setSelectedRun?: (run: number) => void;
}) {
  const [totalRuns, setTotalRuns] = useState(0);

  useEffect(() => {
    const fetchRuns = async () => {
      const response = await fetch("/api/runs");
      const { totalRuns } = await response.json();
      setTotalRuns(totalRuns);
    };

    fetchRuns();
  }, []);

  return (
    <div>
      <p className="text-sm font-black font-title">Showing Run</p>
      <Select
        onValueChange={
          setSelectedRun && ((val) => setSelectedRun(parseInt(val)))
        }
        value={selectedRun?.toString()}
      >
        <SelectTrigger className="w-56">
          <SelectValue placeholder={"Select Run"} />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: totalRuns }, (_, i) => (
            <SelectItem key={i + 1} value={(i + 1).toString()}>
              Run {i + 1}
            </SelectItem>
          )).reverse()}
        </SelectContent>
      </Select>
    </div>
  );
}
