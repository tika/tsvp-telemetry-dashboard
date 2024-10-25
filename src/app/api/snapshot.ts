import { NextResponse } from "next/server";
import { prisma } from "../../lib/db";
import { createSnapshotSchema } from "../../lib/schema";

// Create a new snapshot
export async function POST(res: NextResponse) {
  const rawData = await res.json();
  const data = await createSnapshotSchema.parseAsync(rawData);

  // Create snapshot in prisma
  const snapshot = await prisma.snapshot.create({
    data,
  });

  return Response.json({ snapshot });
}

export async function GET() {
  const data = await prisma.snapshot.findMany();

  return Response.json({ data });
}
