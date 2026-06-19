import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { referenceCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function GET() {
  const items = await prisma.reference.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const body = await req.json().catch(() => null);
  const parsed = referenceCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Doğrulama hatası", issues: parsed.error.flatten() }, { status: 400 });
  const created = await prisma.reference.create({ data: parsed.data });
  revalidateTag("references");
  return NextResponse.json(created, { status: 201 });
}
