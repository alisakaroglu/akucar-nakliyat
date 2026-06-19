"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Inbox } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Modal, Button } from "@/components/admin/ui";

type Quote = {
  id: string; name: string; email: string; phone: string | null;
  fromCity: string | null; toCity: string | null; cargoType: string | null;
  weight: string | null; date: string | null; message: string | null;
  status: "NEW" | "IN_REVIEW" | "CLOSED"; createdAt: string;
};

const statusLabel: Record<Quote["status"], string> = {
  NEW: "Yeni", IN_REVIEW: "İncelemede", CLOSED: "Kapandı",
};
const statusCls: Record<Quote["status"], string> = {
  NEW: "bg-accent-soft text-accent",
  IN_REVIEW: "bg-info/15 text-info",
  CLOSED: "bg-overlay text-text-faint",
};
const fmt = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

export default function QuotesAdminPage() {
  const qc = useQueryClient();
  const [active, setActive] = useState<Quote | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["quotes"],
    queryFn: () => apiFetch<Quote[]>("/api/quote"),
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["quotes"] });

  const statusMut = useMutation({
    mutationFn: (v: { id: string; status: Quote["status"] }) =>
      apiFetch(`/api/quote/${v.id}`, { method: "PATCH", body: JSON.stringify({ status: v.status }) }),
    onSuccess: (_d, v) => { invalidate(); setActive((a) => (a ? { ...a, status: v.status } : a)); },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/quote/${id}`, { method: "DELETE" }),
    onSuccess: () => { invalidate(); setActive(null); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h2 font-semibold">Teklif Talepleri</h1>
        <p className="mt-1 text-body text-text-muted">Formdan gelen talepleri görüntüleyin ve yönetin.</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : (data?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Inbox className="h-8 w-8 text-text-faint" />
            <p className="mt-3 text-small text-text-faint">Henüz teklif talebi yok.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle text-overline uppercase text-text-faint">
                <th className="px-6 py-3 text-start font-medium">Ad</th>
                <th className="px-6 py-3 text-start font-medium">Güzergâh</th>
                <th className="px-6 py-3 text-start font-medium">Durum</th>
                <th className="px-6 py-3 text-start font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {data!.map((q) => (
                <tr key={q.id} onClick={() => setActive(q)}
                  className="cursor-pointer transition hover:bg-overlay/50">
                  <td className="px-6 py-4">
                    <div className="text-body text-text-primary">{q.name}</div>
                    <div className="text-small text-text-muted">{q.email}</div>
                  </td>
                  <td className="px-6 py-4 text-small text-text-muted">
                    {[q.fromCity, q.toCity].filter(Boolean).join(" → ") || "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-overline uppercase ${statusCls[q.status]}`}>
                      {statusLabel[q.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-small text-text-muted">{fmt(q.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title="Teklif talebi"
        footer={active && (
          <>
            <Button variant="danger" onClick={() => { if (confirm("Bu talep silinsin mi?")) delMut.mutate(active.id); }}>
              <Trash2 className="h-4 w-4" /> Sil
            </Button>
            <Button variant="secondary" onClick={() => setActive(null)}>Kapat</Button>
          </>
        )}
      >
        {active && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-body">
              <Field label="Ad Soyad" value={active.name} />
              <Field label="E-posta" value={active.email} />
              <Field label="Telefon" value={active.phone || "—"} />
              <Field label="Tarih (talep)" value={active.date ? fmt(active.date) : "—"} />
              <Field label="Nereden" value={active.fromCity || "—"} />
              <Field label="Nereye" value={active.toCity || "—"} />
              <Field label="Yük tipi" value={active.cargoType || "—"} />
              <Field label="Ağırlık/Hacim" value={active.weight || "—"} />
            </div>
            {active.message && (
              <div>
                <div className="text-overline uppercase text-text-faint">Mesaj</div>
                <p className="mt-1 whitespace-pre-line text-body text-text-primary">{active.message}</p>
              </div>
            )}
            <div>
              <div className="mb-2 text-overline uppercase text-text-faint">Durum</div>
              <div className="flex gap-2">
                {(["NEW", "IN_REVIEW", "CLOSED"] as const).map((s) => (
                  <button key={s}
                    onClick={() => statusMut.mutate({ id: active.id, status: s })}
                    disabled={statusMut.isPending}
                    className={[
                      "rounded-md px-3 py-2 text-small font-medium transition",
                      active.status === s ? statusCls[s] + " ring-1 ring-accent/40" : "bg-overlay text-text-muted hover:text-text-primary",
                    ].join(" ")}>
                    {statusLabel[s]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-overline uppercase text-text-faint">{label}</div>
      <div className="mt-0.5 text-body text-text-primary">{value}</div>
    </div>
  );
}
