"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, BarChart3 } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Modal, Button, LocalizedInput, fieldInput } from "@/components/admin/ui";

type Loc = { tr?: string; en?: string; ar?: string };
type Stat = { id: string; key: string; label: Loc; value: number; suffix?: string | null; order: number };
const show = (l?: Loc) => l?.tr || l?.en || l?.ar || "—";
const empty = { key: "", label: {} as Loc, value: 0, suffix: "", order: 0 };

export default function StatsAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Stat | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [error, setError] = useState<string | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ["admin-stats"], queryFn: () => apiFetch<Stat[]>("/api/admin/stats") });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-stats"] });
  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = { ...form, value: Number(form.value) || 0, order: Number(form.order) || 0 };
      if (editing) return apiFetch(`/api/stats/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      return apiFetch("/api/stats", { method: "POST", body: JSON.stringify(payload) });
    },
    onSuccess: () => { invalidate(); setOpen(false); },
    onError: (e) => setError(e instanceof Error ? e.message : "Hata"),
  });
  const delMut = useMutation({ mutationFn: (id: string) => apiFetch(`/api/stats/${id}`, { method: "DELETE" }), onSuccess: invalidate });
  function openNew(){ setEditing(null); setForm(empty); setError(null); setOpen(true); }
  function openEdit(s: Stat){ setEditing(s); setForm({ key:s.key, label:s.label??{}, value:s.value, suffix:s.suffix??"", order:s.order }); setError(null); setOpen(true); }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-h2 font-semibold">İstatistik Sayaçları</h1>
          <p className="mt-1 text-body text-text-muted">Anasayfadaki sayıları güncelleyin.</p></div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Yeni sayaç</Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        : (data?.length ?? 0) === 0 ? <div className="flex flex-col items-center px-6 py-16 text-center"><BarChart3 className="h-8 w-8 text-text-faint" /><p className="mt-3 text-small text-text-faint">Henüz sayaç yok.</p></div>
        : <table className="w-full"><thead><tr className="border-b border-border-subtle text-overline uppercase text-text-faint">
            <th className="px-6 py-3 text-start font-medium">Etiket</th><th className="px-6 py-3 text-start font-medium">Değer</th><th className="px-6 py-3 text-end font-medium">İşlem</th></tr></thead>
          <tbody className="divide-y divide-border-subtle">{data!.map((s) => (
            <tr key={s.id} className="transition hover:bg-overlay/50">
              <td className="px-6 py-4 font-medium text-text-primary">{show(s.label)}</td>
              <td className="px-6 py-4 text-small text-accent">{s.value.toLocaleString("tr-TR")}{s.suffix}</td>
              <td className="px-6 py-4"><div className="flex items-center justify-end gap-2">
                <button onClick={()=>openEdit(s)} className="rounded-md p-2 text-text-muted hover:bg-overlay hover:text-accent"><Pencil className="h-4 w-4" /></button>
                <button onClick={()=>{ if(confirm("Sayaç silinsin mi?")) delMut.mutate(s.id); }} className="rounded-md p-2 text-text-muted hover:bg-overlay hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div></td></tr>))}</tbody></table>}
      </div>
      <Modal open={open} onClose={()=>setOpen(false)} title={editing?"Sayacı düzenle":"Yeni sayaç"}
        footer={<><Button variant="secondary" onClick={()=>setOpen(false)}>Vazgeç</Button>
          <Button onClick={()=>{ setError(null); saveMut.mutate(); }} disabled={saveMut.isPending}>{saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{editing?"Kaydet":"Oluştur"}</Button></>}>
        <div className="space-y-5">
          {error && <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-small text-danger">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-3">
            <div><label className="mb-2 block text-small text-text-muted">Anahtar</label>
              <input className={fieldInput} value={form.key} onChange={(e)=>setForm({...form,key:e.target.value})} placeholder="years" disabled={!!editing} /></div>
            <div><label className="mb-2 block text-small text-text-muted">Değer</label>
              <input type="number" className={fieldInput} value={form.value} onChange={(e)=>setForm({...form,value:Number(e.target.value)})} /></div>
            <div><label className="mb-2 block text-small text-text-muted">Sonek</label>
              <input className={fieldInput} value={form.suffix} onChange={(e)=>setForm({...form,suffix:e.target.value})} placeholder="+" /></div>
          </div>
          <LocalizedInput label="Etiket" value={form.label} onChange={(v)=>setForm({...form,label:v})} />
          <div className="w-32"><label className="mb-2 block text-small text-text-muted">Sıra</label>
            <input type="number" className={fieldInput} value={form.order} onChange={(e)=>setForm({...form,order:Number(e.target.value)})} /></div>
        </div>
      </Modal>
    </div>
  );
}
