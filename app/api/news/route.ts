import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { newsCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

// Public: yayınlanmış haberler (yayın tarihine göre).
export async function GET() {
  const items = await prisma.newsPost.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });
  return NextResponse.json(items);
}

// Korumalı: haber oluştur.
export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;

  const body = await req.json().catch(() => null);
  const parsed = newsCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Doğrulama hatası", issues: parsed.error.flatten() }, { status: 400 });
  }

  const exists = await prisma.newsPost.findUnique({ where: { slug: parsed.data.slug } });
  if (exists) return NextResponse.json({ error: "Slug zaten kullanımda" }, { status: 409 });

  const { publishedAt, ...rest } = parsed.data;
  const created = await prisma.newsPost.create({
    data: { ...rest, publishedAt: publishedAt ? new Date(publishedAt) : null },
  });
  revalidateTag("news");
  return NextResponse.json(created, { status: 201 });
}
