import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { NextResponse } from "next/server";

const secret = () => {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET tanımlı değil");
  return new TextEncoder().encode(s);
};

export type AdminClaims = JWTPayload & {
  sub: string;
  email: string;
  role: "ADMIN" | "EDITOR";
};

export async function signToken(claims: {
  sub: string;
  email: string;
  role: "ADMIN" | "EDITOR";
}): Promise<string> {
  return new SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function verifyToken(token: string): Promise<AdminClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as AdminClaims;
  } catch {
    return null;
  }
}

// İstekten admin doğrula. Yetkisizse null döner (route 401 verir).
export async function getAdmin(req: Request): Promise<AdminClaims | null> {
  const header = req.headers.get("authorization") ?? "";
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;
  return verifyToken(token);
}

// Korumalı route'larda kısayol: yetki yoksa 401 Response döndürür.
export async function requireAdmin(
  req: Request
): Promise<AdminClaims | NextResponse> {
  const admin = await getAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 401 });
  }
  return admin;
}

export function isResponse(x: unknown): x is NextResponse {
  return x instanceof NextResponse;
}
