import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";
import { contactSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Korumalı: iletişim mesajlarını listele (panel).
export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;
  const items = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(items);
}

// Public: iletişim mesajı.
export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimit(`contact:${ip}`, 5, 60_000).ok) {
    return NextResponse.json({ error: "Çok fazla istek" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Doğrulama hatası", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const created = await prisma.contactMessage.create({ data: parsed.data });
  return NextResponse.json({ ok: true, id: created.id }, { status: 201 });
}
