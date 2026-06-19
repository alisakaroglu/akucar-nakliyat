import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { newsUpdateSchema } from "@/lib/validation";

export const runtime = "nodejs";

type Params = { params: { id: string } };

export async function PUT(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;

  const body = await req.json().catch(() => null);
  const parsed = newsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Doğrulama hatası", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { publishedAt, ...rest } = parsed.data;
  const data: Record<string, unknown> = { ...rest };
  if (publishedAt !== undefined) data.publishedAt = publishedAt ? new Date(publishedAt) : null;

  const updated = await prisma.newsPost.update({ where: { id: params.id }, data }).catch(() => null);
  if (!updated) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  revalidateTag("news");
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const deleted = await prisma.newsPost.delete({ where: { id: params.id } }).catch(() => null);
  if (!deleted) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  revalidateTag("news");
  return NextResponse.json({ ok: true });
}
