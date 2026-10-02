import { NextResponse } from "next/server";
import { createWorkspace, getWorkspace } from "@/lib/workspace";

export async function POST() {
  const existingWorkspace = await getWorkspace();

  if (existingWorkspace) {
    return NextResponse.json({ success: true });
  }

  await createWorkspace();

  return NextResponse.json({ success: true });
}