import { NextResponse } from "next/server";
import { getReleases } from "@/lib/data/releases";

export const revalidate = 3600;

export async function GET() {
  const releases = await getReleases();

  const index = releases.slice(0, 200).map((r) => ({
    id: r.id,
    technology: r.technology,
    version: r.version,
    category: r.category,
  }));

  return NextResponse.json(index);
}
