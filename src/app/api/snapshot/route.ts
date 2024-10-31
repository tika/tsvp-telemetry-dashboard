import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { createSnapshotSchema } from "../../../lib/schema";

// Create a new snapshot
export async function POST(request: NextRequest) {
  const rawData = await request.json();
  const data = await createSnapshotSchema.parseAsync(rawData);

  // Create snapshot in prisma
  const snapshot = await prisma.snapshot.create({
    data,
  });

  return NextResponse.json({ snapshot });
}

export async function GET() {
  const data = await prisma.snapshot.findMany();

  return NextResponse.json({ data });
} 
