import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { newsletterSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Korumalı: aboneleri listele (CSV dışa aktarma için de kullanılır).
export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const items = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

// Public: bülten aboneliği (idempotent).
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`newsletter:${ip}`, 5, 60_000).ok) {
    return NextResponse.json({ error: "Çok fazla istek" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz e-posta" }, { status: 400 });
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    update: { locale: parsed.data.locale },
    create: parsed.data,
  });
  return NextResponse.json({ ok: true }, { status: 201 });
}
