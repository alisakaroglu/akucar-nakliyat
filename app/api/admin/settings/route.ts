import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";

export const runtime = "nodejs";

// Korumalı: tüm ayarları { key: value } map olarak döndür.
export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const rows = await prisma.siteSetting.findMany();
  const map: Record<string, unknown> = {};
  for (const r of rows) map[r.key] = r.value;
  return NextResponse.json(map);
}

const putSchema = z.object({
  key: z.string().min(1).max(60),
  value: z.any(),
});

// Korumalı: tek ayarı kaydet (upsert).
export async function PUT(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;

  const body = await req.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz ayar" }, { status: 400 });
  }
  const { key, value } = parsed.data;
  const saved = await prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidateTag("settings");
  return NextResponse.json(saved);
}
