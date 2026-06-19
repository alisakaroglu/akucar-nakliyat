import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAdmin, isResponse } from "@/lib/auth";

export const runtime = "nodejs";

const MAX = 5 * 1024 * 1024; // 5 MB
const OK_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/svg+xml"];

function cloudinaryConfigured() {
  return !!(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

// Korumalı: görsel yükleme. Cloudinary yapılandırılıysa oraya, değilse public/uploads'a.
export async function POST(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 });
  }
  if (!OK_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Yalnızca görsel (jpg, png, webp, avif, svg)" }, { status: 415 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "Dosya 5MB'tan büyük olamaz" }, { status: 413 });
  }

  const bytes = Buffer.from(await file.arrayBuffer());

  // 1) Cloudinary (production önerilen)
  if (cloudinaryConfigured()) {
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const dataUri = `data:${file.type};base64,${bytes.toString("base64")}`;
    const res = await cloudinary.uploader.upload(dataUri, { folder: "akucar", resource_type: "image" });
    return NextResponse.json({ url: res.secure_url, publicId: res.public_id });
  }

  // 2) Yerel disk yedeği (geliştirme / Node host)
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const ext = (file.name.split(".").pop() || "bin").toLowerCase().replace(/[^a-z0-9]/g, "");
  const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  await writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ url: `/uploads/${name}` });
}
