import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { fleetCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const items = await prisma.fleetItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const body = await req.json().catch(() => null);
  const parsed = fleetCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Doğrulama hatası", issues: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.fleetItem.create({ data: parsed.data });
  revalidateTag("fleet");
  return NextResponse.json(created, { status: 201 });
}
