import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { pageCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

// Public: yayınlanmış sayfalar (liste).
export async function GET() {
  const items = await prisma.page.findMany({ where: { status: "PUBLISHED" }, orderBy: { updatedAt: "desc" } });
  return NextResponse.json(items);
}

// Korumalı: sayfa oluştur.
export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const body = await req.json().catch(() => null);
  const parsed = pageCreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Doğrulama hatası", issues: parsed.error.flatten() }, { status: 400 });
  const exists = await prisma.page.findUnique({ where: { slug: parsed.data.slug } });
  if (exists) return NextResponse.json({ error: "Slug zaten kullanımda" }, { status: 409 });
  const created = await prisma.page.create({ data: parsed.data });
  revalidateTag("pages");
  return NextResponse.json(created, { status: 201 });
}
