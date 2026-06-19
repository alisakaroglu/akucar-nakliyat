"use client";

import { useQuery } from "@tanstack/react-query";
import { Truck, Newspaper, Inbox, Mail, Users, Loader2, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/admin/api";

type Overview = {
  counts: { services: number; news: number; quotesNew: number; messages: number; subscribers: number };
  recentQuotes: { id: string; name: string; email: string; fromCity: string | null; toCity: string | null; createdAt: string; status: string }[];
  recentMessages: { id: string; name: string; email: string; message: string; createdAt: string }[];
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["overview"],
    queryFn: () => apiFetch<Overview>("/api/admin/overview"),
  });

  const cards = [
    { key: "quotesNew", label: "Yeni teklif talebi", Icon: Inbox, href: "/admin/quotes", accent: true },
    { key: "messages", label: "Okunmamış mesaj", Icon: Mail, href: "/admin/messages", accent: true },
    { key: "services", label: "Hizmet", Icon: Truck, href: "/admin/services" },
    { key: "news", label: "Haber", Icon: Newspaper, href: "/admin/news" },
    { key: "subscribers", label: "Bülten abonesi", Icon: Users, href: "/admin/subscribers" },
  ] as const;

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-h2 font-semibold">Genel Bakış</h1>
        <p className="mt-1 text-body text-text-muted">Sitenizin güncel durumu ve son talepler.</p>
      </div>

      {/* Özet kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map(({ key, label, Icon, href, accent }) => (
          <Link
            key={key}
            href={href}
            className="group rounded-lg border border-border-subtle bg-elevated p-6 shadow-card transition hover:-translate-y-0.5 hover:border-accent/60"
          >
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-md ${accent ? "bg-accent-soft" : "bg-overlay"}`}>
                <Icon className={`h-5 w-5 ${accent ? "text-accent" : "text-text-muted"}`} />
              </span>
              <ArrowUpRight className="h-4 w-4 text-text-faint transition group-hover:text-accent" />
            </div>
            <div className="mt-4 font-display text-h1 font-semibold">
              {data?.counts[key] ?? 0}
            </div>
            <div className="mt-1 text-small text-text-muted">{label}</div>
          </Link>
        ))}
      </div>

      {/* Son talepler */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-border-subtle bg-elevated shadow-card">
          <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
            <h2 className="font-display text-h4 font-medium">Son teklif talepleri</h2>
            <Link href="/admin/quotes" className="text-small text-accent">Tümü</Link>
          </div>
          <div className="divide-y divide-border-subtle">
            {(data?.recentQuotes ?? []).length === 0 && (
              <p className="px-6 py-8 text-center text-small text-text-faint">Henüz talep yok.</p>
            )}
            {data?.recentQuotes.map((q) => (
              <div key={q.id} className="flex items-center justify-between px-6 py-4">
                <div className="min-w-0">
                  <div className="truncate text-body text-text-primary">{q.name}</div>
                  <div className="truncate text-small text-text-muted">
                    {[q.fromCity, q.toCity].filter(Boolean).join(" → ") || q.email}
                  </div>
                </div>
                <div className="ms-4 shrink-0 text-end">
                  <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-overline uppercase text-accent">
                    {q.status}
                  </span>
                  <div className="mt-1 text-overline uppercase text-text-faint">{fmt(q.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border-subtle bg-elevated shadow-card">
          <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
            <h2 className="font-display text-h4 font-medium">Son mesajlar</h2>
            <Link href="/admin/messages" className="text-small text-accent">Tümü</Link>
          </div>
          <div className="divide-y divide-border-subtle">
            {(data?.recentMessages ?? []).length === 0 && (
              <p className="px-6 py-8 text-center text-small text-text-faint">Henüz mesaj yok.</p>
            )}
            {data?.recentMessages.map((m) => (
              <div key={m.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="truncate text-body text-text-primary">{m.name}</div>
                  <div className="ms-4 shrink-0 text-overline uppercase text-text-faint">{fmt(m.createdAt)}</div>
                </div>
                <p className="mt-1 line-clamp-2 text-small text-text-muted">{m.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
