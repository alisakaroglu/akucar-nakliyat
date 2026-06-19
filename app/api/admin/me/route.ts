import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";

export const runtime = "nodejs";

// Korumalı: token'daki kullanıcının güncel bilgisi (panel oturum doğrulama).
export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;

  const user = await prisma.user.findUnique({
    where: { id: admin.sub },
    select: { id: true, email: true, name: true, role: true },
  });
  if (!user) return NextResponse.json({ error: "Bulunamadı" }, { status: 404 });
  return NextResponse.json({ user });
}
