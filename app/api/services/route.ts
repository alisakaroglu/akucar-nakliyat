import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { serviceCreateSchema } from "@/lib/validation";

export const runtime = "nodejs";

// Public: yayınlanmış hizmetleri sıralı döndür.
export async function GET() {
  const services = await prisma.service.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(services);
}

// Korumalı: yeni hizmet oluştur.
export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;

  const body = await req.json().catch(() => null);
  const parsed = serviceCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Doğrulama hatası", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const exists = await prisma.service.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (exists) {
    return NextResponse.json({ error: "Slug zaten kullanımda" }, { status: 409 });
  }

  const created = await prisma.service.create({ data: parsed.data });
  revalidateTag("services");
  return NextResponse.json(created, { status: 201 });
}
