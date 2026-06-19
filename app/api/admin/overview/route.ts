import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, isResponse } from "@/lib/auth";

export const runtime = "nodejs";

// Korumalı: dashboard özeti (sayımlar + son talepler).
export async function GET(req: Request) {
  const admin = await requireAdmin(req);
  if (isResponse(admin)) return admin;

  const [services, news, quotesNew, messages, subscribers, recentQuotes, recentMessages] =
    await Promise.all([
      prisma.service.count(),
      prisma.newsPost.count(),
      prisma.quoteRequest.count({ where: { status: "NEW" } }),
      prisma.contactMessage.count({ where: { handled: false } }),
      prisma.newsletterSubscriber.count(),
      prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    ]);

  return NextResponse.json({
    counts: { services, news, quotesNew, messages, subscribers },
    recentQuotes,
    recentMessages,
  });
}
