import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { routeCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

// Public: görünür güzergahlar (teklif formu için), sıralı.
export async function GET() {
  const items = await prisma.route.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

// Korumalı: yeni güzergah.
export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const body = await req.json().catch(() => null);
  const parsed = routeCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Doğrulama hatası", issues: parsed.error.flatten() }, { status: 400 });
  }
  const created = await prisma.route.create({ data: parsed.data });
  revalidateTag("routes");
  return NextResponse.json(created, { status: 201 });
}
