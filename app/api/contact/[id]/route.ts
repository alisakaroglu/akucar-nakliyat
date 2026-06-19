import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";

export const runtime = "nodejs";

type Params = { params: { id: string } };

const patchSchema = z.object({ handled: z.boolean() });

// Korumalı: mesajı okundu/işlendi olarak işaretle.
export async function PATCH(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;

  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const updated = await prisma.contactMessage
    .update({ where: { id: params.id }, data: { handled: parsed.data.handled } })
    .catch(() => null);
  if (!updated) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json(updated);
}

// Korumalı: sil.
export async function DELETE(req: Request, { params }: Params) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;

  const deleted = await prisma.contactMessage
    .delete({ where: { id: params.id } })
    .catch(() => null);
  if (!deleted) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
