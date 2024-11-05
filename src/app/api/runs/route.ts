import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

// Time gap (in seconds) that defines a new run
const RUN_GAP_THRESHOLD = 5;

async function calculateRuns() {
  // Get all snapshots ordered by time
  const snapshots = await prisma.snapshot.findMany({
    orderBy: {
      time: 'asc'
    }
  });

  const runs: { startTime: Date; endTime: Date; snapshots: number }[] = [];
  let currentRun: typeof runs[0] | null = null;

  snapshots.forEach((snapshot) => {
    if (!currentRun) {
      // Start first run
      currentRun = {
        startTime: snapshot.time,
        endTime: snapshot.time,
        snapshots: 1
      };
    } else {
      // Check time difference
      const timeDiff = (snapshot.time.getTime() - currentRun.endTime.getTime()) / 1000;

      if (timeDiff > RUN_GAP_THRESHOLD) {
        // Gap detected, save current run and start new one
        runs.push(currentRun);
        currentRun = {
          startTime: snapshot.time,
          endTime: snapshot.time,
          snapshots: 1
        };
      } else {
        // Continue current run
        currentRun.endTime = snapshot.time;
        currentRun.snapshots++;
      }
    }
  });

  // Add final run if exists
  if (currentRun) {
    runs.push(currentRun);
  }

  return runs;
}

export async function GET() {
  const runs = await calculateRuns();
  return NextResponse.json({
    totalRuns: runs.length,
    runs: runs.map((run, index) => ({
      id: index + 1,
      ...run
    }))
  });
} 
