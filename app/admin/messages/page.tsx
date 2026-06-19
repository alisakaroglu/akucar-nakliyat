"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, Mail, Check } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Modal, Button } from "@/components/admin/ui";

type Message = {
  id: string; name: string; email: string; phone: string | null;
  route: string | null; message: string; handled: boolean; createdAt: string;
};

const fmt = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

export default function MessagesAdminPage() {
  const qc = useQueryClient();
  const [active, setActive] = useState<Message | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["messages"],
    queryFn: () => apiFetch<Message[]>("/api/contact"),
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["messages"] });

  const handledMut = useMutation({
    mutationFn: (v: { id: string; handled: boolean }) =>
      apiFetch(`/api/contact/${v.id}`, { method: "PATCH", body: JSON.stringify({ handled: v.handled }) }),
    onSuccess: (_d, v) => { invalidate(); setActive((a) => (a ? { ...a, handled: v.handled } : a)); },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/contact/${id}`, { method: "DELETE" }),
    onSuccess: () => { invalidate(); setActive(null); },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-h2 font-semibold">Mesajlar</h1>
        <p className="mt-1 text-body text-text-muted">İletişim formundan gelen mesajlar.</p>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : (data?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <Mail className="h-8 w-8 text-text-faint" />
            <p className="mt-3 text-small text-text-faint">Henüz mesaj yok.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-subtle text-overline uppercase text-text-faint">
                <th className="px-6 py-3 text-start font-medium">Gönderen</th>
                <th className="px-6 py-3 text-start font-medium">Mesaj</th>
                <th className="px-6 py-3 text-start font-medium">Durum</th>
                <th className="px-6 py-3 text-start font-medium">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {data!.map((m) => (
                <tr key={m.id} onClick={() => setActive(m)}
                  className={`cursor-pointer transition hover:bg-overlay/50 ${m.handled ? "" : "bg-accent-soft/20"}`}>
                  <td className="px-6 py-4">
                    <div className="text-body text-text-primary">{m.name}</div>
                    <div className="text-small text-text-muted">{m.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="line-clamp-1 max-w-md text-small text-text-muted">{m.message}</p>
                  </td>
                  <td className="px-6 py-4">
                    {m.handled
                      ? <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-overline uppercase text-success">Okundu</span>
                      : <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-overline uppercase text-accent">Yeni</span>}
                  </td>
                  <td className="px-6 py-4 text-small text-text-muted">{fmt(m.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title="Mesaj"
        footer={active && (
          <>
            <Button variant="danger" onClick={() => { if (confirm("Mesaj silinsin mi?")) delMut.mutate(active.id); }}>
              <Trash2 className="h-4 w-4" /> Sil
            </Button>
            <Button onClick={() => handledMut.mutate({ id: active.id, handled: !active.handled })} disabled={handledMut.isPending}>
              <Check className="h-4 w-4" /> {active.handled ? "Okunmadı yap" : "Okundu işaretle"}
            </Button>
          </>
        )}
      >
        {active && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Ad Soyad" value={active.name} />
              <Field label="E-posta" value={active.email} />
              <Field label="Telefon" value={active.phone || "—"} />
              <Field label="Güzergâh" value={active.route || "—"} />
            </div>
            <div>
              <div className="text-overline uppercase text-text-faint">Mesaj</div>
              <p className="mt-1 whitespace-pre-line text-body text-text-primary">{active.message}</p>
            </div>
            <a href={`mailto:${active.email}`} className="inline-flex text-small text-accent">E-posta ile yanıtla →</a>
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
