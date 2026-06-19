import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validation";
import { rateLimit, clientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // 0) Sunucu yapılandırması: JWT_SECRET yoksa net hata.
  if (!process.env.JWT_SECRET) {
    return NextResponse.json(
      { error: "Sunucu yapılandırması eksik: JWT_SECRET tanımlı değil (.env) ve dev sunucusu yeniden başlatılmalı." },
      { status: 500 }
    );
  }

  // 1) Brute-force koruması: IP başına 5 deneme / dakika.
  const ip = clientIp(req);
  if (!rateLimit(`login:${ip}`, 5, 60_000).ok) {
    return NextResponse.json({ error: "Çok fazla deneme. Bir dakika sonra tekrar deneyin." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Geçersiz e-posta veya parola biçimi" }, { status: 400 });
  }

  const { email, password } = parsed.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !ok) {
      return NextResponse.json({ error: "E-posta veya parola hatalı" }, { status: 401 });
    }

    const token = await signToken({ sub: user.id, email: user.email, role: user.role });
    return NextResponse.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Veritabanı hatası: migration/seed yapıldı mı ve DATABASE_URL doğru mu? (" + msg.slice(0, 140) + ")" },
      { status: 500 }
    );
  }
}
