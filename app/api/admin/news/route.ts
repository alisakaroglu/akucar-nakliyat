import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";

export const runtime = "nodejs";

// Korumalı: tüm haberler (taslak dahil).
export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const items = await prisma.newsPost.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}
