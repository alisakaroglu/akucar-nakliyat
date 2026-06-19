import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { heroUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";
type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const body = await req.json().catch(() => null);
  const parsed = heroUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Doğrulama hatası" }, { status: 400 });
  const updated = await prisma.heroSlide.update({ where: { id: params.id }, data: parsed.data }).catch(() => null);
  if (!updated) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  revalidateTag("hero");
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const deleted = await prisma.heroSlide.delete({ where: { id: params.id } }).catch(() => null);
  if (!deleted) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  revalidateTag("hero");
  return NextResponse.json({ ok: true });
}
