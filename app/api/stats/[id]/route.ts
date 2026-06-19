import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { statUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";
type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const body = await req.json().catch(() => null);
  const parsed = statUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Doğrulama hatası" }, { status: 400 });
  const updated = await prisma.stat.update({ where: { id: params.id }, data: parsed.data }).catch(() => null);
  if (!updated) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  revalidateTag("stats");
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const deleted = await prisma.stat.delete({ where: { id: params.id } }).catch(() => null);
  if (!deleted) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  revalidateTag("stats");
  return NextResponse.json({ ok: true });
}
