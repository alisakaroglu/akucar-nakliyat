"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, HelpCircle } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Modal, Button, LocalizedInput, fieldInput } from "@/components/admin/ui";

type Loc = { tr?: string; en?: string; ar?: string };
type Faq = { id: string; question: Loc; answer: Loc; order: number; visible: boolean };

const show = (l?: Loc) => l?.tr || l?.en || l?.ar || "—";
const empty = { question: {} as Loc, answer: {} as Loc, order: 0, visible: true };

export default function FaqAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Faq | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["admin-faq"], queryFn: () => apiFetch<Faq[]>("/api/admin/faq") });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-faq"] });

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editing) return apiFetch(`/api/faq/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      return apiFetch("/api/faq", { method: "POST", body: JSON.stringify(payload) });
    },
    onSuccess: () => { invalidate(); setOpen(false); },
    onError: (e) => setError(e instanceof Error ? e.message : "Hata"),
  });
  const delMut = useMutation({ mutationFn: (id: string) => apiFetch(`/api/faq/${id}`, { method: "DELETE" }), onSuccess: invalidate });

  function openNew() { setEditing(null); setForm(empty); setError(null); setOpen(true); }
  function openEdit(f: Faq) {
    setEditing(f);
    setForm({ question: f.question ?? {}, answer: f.answer ?? {}, order: f.order, visible: f.visible });
    setError(null); setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">Sıkça Sorulan Sorular</h1>
          <p className="mt-1 text-body text-text-muted">Soru/cevap ekleyin, düzenleyin, sıralayın.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Yeni soru</Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : (data?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <HelpCircle className="h-8 w-8 text-text-faint" /><p className="mt-3 text-small text-text-faint">Henüz soru yok.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-border-subtle text-overline uppercase text-text-faint">
              <th className="px-6 py-3 text-start font-medium">Soru</th>
              <th className="px-6 py-3 text-start font-medium">Sıra</th>
              <th className="px-6 py-3 text-end font-medium">İşlem</th>
            </tr></thead>
            <tbody className="divide-y divide-border-subtle">
              {data!.map((f) => (
                <tr key={f.id} className="transition hover:bg-overlay/50">
                  <td className="px-6 py-4 font-medium text-text-primary">{show(f.question)}</td>
                  <td className="px-6 py-4 text-small text-text-muted">{f.order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(f)} aria-label="Düzenle" className="rounded-md p-2 text-text-muted transition hover:bg-overlay hover:text-accent"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm("Bu soru silinsin mi?")) delMut.mutate(f.id); }} aria-label="Sil" className="rounded-md p-2 text-text-muted transition hover:bg-overlay hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Soruyu düzenle" : "Yeni soru"} wide
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Vazgeç</Button>
          <Button onClick={() => { setError(null); saveMut.mutate(); }} disabled={saveMut.isPending}>
            {saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Kaydet" : "Oluştur"}
          </Button>
        </>}>
        <div className="space-y-5">
          {error && <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-small text-danger">{error}</div>}
          <div className="w-32">
            <label className="mb-2 block text-small text-text-muted">Sıra</label>
            <input type="number" className={fieldInput} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
          </div>
          <LocalizedInput label="Soru" value={form.question} onChange={(v) => setForm({ ...form, question: v })} />
          <LocalizedInput label="Cevap" value={form.answer} onChange={(v) => setForm({ ...form, answer: v })} textarea />
          <label className="flex items-center gap-2 text-small text-text-muted">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} /> Sitede görünür
          </label>
        </div>
      </Modal>
    </div>
  );
}
