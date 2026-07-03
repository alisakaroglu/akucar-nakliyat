import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";

export const runtime = "nodejs";

// Korumalı: tüm güzergahlar (gizli dahil) — panel listesi.
export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const items = await prisma.route.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}
