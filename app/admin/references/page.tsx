"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Building2 } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Modal, Button, LocalizedInput, fieldInput } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Loc = { tr?: string; en?: string; ar?: string };
type Ref = { id: string; name: Loc; logoUrl?: string | null; website?: string | null; order: number; visible: boolean };
const show = (l?: Loc) => l?.tr || l?.en || l?.ar || "—";
const empty = { name: {} as Loc, logoUrl: "", website: "", order: 0, visible: true };

export default function ReferencesAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Ref | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [error, setError] = useState<string | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ["admin-references"], queryFn: () => apiFetch<Ref[]>("/api/admin/references") });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-references"] });
  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editing) return apiFetch(`/api/references/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      return apiFetch("/api/references", { method: "POST", body: JSON.stringify(payload) });
    },
    onSuccess: () => { invalidate(); setOpen(false); },
    onError: (e) => setError(e instanceof Error ? e.message : "Hata"),
  });
  const delMut = useMutation({ mutationFn: (id: string) => apiFetch(`/api/references/${id}`, { method: "DELETE" }), onSuccess: invalidate });
  function openNew() { setEditing(null); setForm(empty); setError(null); setOpen(true); }
  function openEdit(r: Ref) { setEditing(r); setForm({ name: r.name ?? {}, logoUrl: r.logoUrl ?? "", website: r.website ?? "", order: r.order, visible: r.visible }); setError(null); setOpen(true); }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-h2 font-semibold">Referanslar</h1>
          <p className="mt-1 text-body text-text-muted">Müşteri logolarını ekleyin ve sıralayın.</p></div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Yeni referans</Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        : (data?.length ?? 0) === 0 ? <div className="flex flex-col items-center px-6 py-16 text-center"><Building2 className="h-8 w-8 text-text-faint" /><p className="mt-3 text-small text-text-faint">Henüz referans yok.</p></div>
        : <table className="w-full"><thead><tr className="border-b border-border-subtle text-overline uppercase text-text-faint">
            <th className="px-6 py-3 text-start font-medium">Ad</th><th className="px-6 py-3 text-start font-medium">Web</th><th className="px-6 py-3 text-start font-medium">Sıra</th><th className="px-6 py-3 text-end font-medium">İşlem</th></tr></thead>
          <tbody className="divide-y divide-border-subtle">{data!.map((r) => (
            <tr key={r.id} className="transition hover:bg-overlay/50">
              <td className="px-6 py-4 font-medium text-text-primary">{show(r.name)}</td>
              <td className="px-6 py-4 text-small text-text-muted">{r.website || "—"}</td>
              <td className="px-6 py-4 text-small text-text-muted">{r.order}</td>
              <td className="px-6 py-4"><div className="flex items-center justify-end gap-2">
                <button onClick={() => openEdit(r)} className="rounded-md p-2 text-text-muted hover:bg-overlay hover:text-accent"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => { if (confirm(`“${show(r.name)}” silinsin mi?`)) delMut.mutate(r.id); }} className="rounded-md p-2 text-text-muted hover:bg-overlay hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div></td></tr>))}</tbody></table>}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Referansı düzenle" : "Yeni referans"}
        footer={<><Button variant="secondary" onClick={() => setOpen(false)}>Vazgeç</Button>
          <Button onClick={() => { setError(null); saveMut.mutate(); }} disabled={saveMut.isPending}>{saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Kaydet" : "Oluştur"}</Button></>}>
        <div className="space-y-5">
          {error && <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-small text-danger">{error}</div>}
          <LocalizedInput label="Ad" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <ImageUpload label="Logo" value={form.logoUrl} onChange={(url) => setForm({ ...form, logoUrl: url })} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label className="mb-2 block text-small text-text-muted">Web sitesi</label>
              <input className={fieldInput} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://" /></div>
            <div><label className="mb-2 block text-small text-text-muted">Sıra</label>
              <input type="number" className={fieldInput} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} /></div>
          </div>
          <label className="flex items-center gap-2 text-small text-text-muted">
            <input type="checkbox" checked={form.visible} onChange={(e) => setForm({ ...form, visible: e.target.checked })} /> Sitede görünür</label>
        </div>
      </Modal>
    </div>
  );
}
