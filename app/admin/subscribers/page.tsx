"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, Users, Download } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Button } from "@/components/admin/ui";

type Subscriber = { id: string; email: string; locale: string | null; createdAt: string };

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(iso));

function toCsv(rows: Subscriber[]) {
  const head = ["email", "locale", "createdAt"];
  const body = rows.map((r) =>
    [r.email, r.locale ?? "", r.createdAt].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")
  );
  return [head.join(","), ...body].join("\n");
}

export default function SubscribersAdminPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["subscribers"],
    queryFn: () => apiFetch<Subscriber[]>("/api/newsletter"),
  });

  function exportCsv() {
    if (!data?.length) return;
    const blob = new Blob(["﻿" + toCsv(data)], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `aboneler-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">Bülten Aboneleri</h1>
          <p className="mt-1 text-body text-text-muted">
            {data ? `${data.length} abone` : "Aboneleri görüntüleyin ve dışa aktarın."}
          </p>
        </div>
        <Button onClick={exportCsv} disabled={!data?.length}>
          <Download className="h-4 w-4" /> CSV indir
        </Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : (data?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Users className="h-8 w-8 text-text-faint" />
            <p className="mt-3 text-small text-text-faint">Henüz abone yok.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle text-overline uppercase text-text-faint">
                <th className="px-6 py-3 text-start font-medium">E-posta</th>
                <th className="px-6 py-3 text-start font-medium">Dil</th>
                <th className="px-6 py-3 text-start font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {data!.map((s) => (
                <tr key={s.id} className="transition hover:bg-overlay/50">
                  <td className="px-6 py-4 text-body text-text-primary">{s.email}</td>
                  <td className="px-6 py-4 text-small uppercase text-text-muted">{s.locale || "—"}</td>
                  <td className="px-6 py-4 text-small text-text-muted">{fmt(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
