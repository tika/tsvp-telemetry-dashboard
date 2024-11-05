import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { createSnapshotSchema } from "../../../lib/schema";

const RUN_GAP_THRESHOLD = 5; // in seconds

// Create a new snapshot
export async function POST(request: NextRequest) {
  const rawData = await request.json();
  const data = await createSnapshotSchema.parseAsync(rawData);

  const snapshot = await prisma.snapshot.create({
    data,
  });

  return NextResponse.json({ snapshot });
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const runId = searchParams.get("runId");

  if (!runId) {
    const data = await prisma.snapshot.findMany({
      orderBy: {
        time: "desc",
      },
    });
    return NextResponse.json({ data });
  }

  // Get all snapshots ordered by time
  const allSnapshots = await prisma.snapshot.findMany({
    orderBy: {
      time: "asc",
    },
  });

  let currentRunId = 1;
  let runSnapshots: typeof allSnapshots = [];
  let lastTime: Date | null = null;

  // Group snapshots into runs
  for (const snapshot of allSnapshots) {
    if (!lastTime) {
      runSnapshots.push(snapshot);
    } else {
      const timeDiff = (snapshot.time.getTime() - lastTime.getTime()) / 1000;

      if (timeDiff > RUN_GAP_THRESHOLD) {
        if (currentRunId === parseInt(runId)) {
          break; // We found our run, no need to continue
        }
        currentRunId++;
        runSnapshots = [snapshot]; // Start new run with this snapshot
      } else {
        runSnapshots.push(snapshot);
      }
    }
    lastTime = snapshot.time;
  }

  // Only return the snapshots if we found the correct run
  if (currentRunId === parseInt(runId)) {
    return NextResponse.json({ data: runSnapshots });
  }

  // If we didn't find the run, return empty array
  return NextResponse.json({ data: [] });
}
