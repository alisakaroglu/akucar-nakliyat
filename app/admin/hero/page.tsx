"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Images } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Modal, Button, LocalizedInput, fieldInput } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Loc = { tr?: string; en?: string; ar?: string };
type Slide = { id: string; title: Loc; subtitle?: Loc; image: string; ctaHref?: string | null; order: number; visible: boolean };
const show = (l?: Loc) => l?.tr || l?.en || l?.ar || "—";
const empty = { title: {} as Loc, subtitle: {} as Loc, image: "", ctaHref: "", order: 0, visible: true };

export default function HeroAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Slide | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [error, setError] = useState<string | null>(null);
  const { data, isLoading } = useQuery({ queryKey: ["admin-hero"], queryFn: () => apiFetch<Slide[]>("/api/admin/hero") });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-hero"] });
  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editing) return apiFetch(`/api/hero/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      return apiFetch("/api/hero", { method: "POST", body: JSON.stringify(payload) });
    },
    onSuccess: () => { invalidate(); setOpen(false); },
    onError: (e) => setError(e instanceof Error ? e.message : "Hata"),
  });
  const delMut = useMutation({ mutationFn: (id: string) => apiFetch(`/api/hero/${id}`, { method: "DELETE" }), onSuccess: invalidate });
  function openNew(){ setEditing(null); setForm(empty); setError(null); setOpen(true); }
  function openEdit(s: Slide){ setEditing(s); setForm({ title:s.title??{}, subtitle:s.subtitle??{}, image:s.image, ctaHref:s.ctaHref??"", order:s.order, visible:s.visible }); setError(null); setOpen(true); }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="font-display text-h2 font-semibold">Hero Slaytları</h1>
          <p className="mt-1 text-body text-text-muted">Anasayfa kapak görsel ve sloganları.</p></div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Yeni slayt</Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        : (data?.length ?? 0) === 0 ? <div className="flex flex-col items-center px-6 py-16 text-center"><Images className="h-8 w-8 text-text-faint" /><p className="mt-3 text-small text-text-faint">Henüz slayt yok.</p></div>
        : <table className="w-full"><thead><tr className="border-b border-border-subtle text-overline uppercase text-text-faint">
            <th className="px-6 py-3 text-start font-medium">Başlık</th><th className="px-6 py-3 text-start font-medium">Sıra</th><th className="px-6 py-3 text-end font-medium">İşlem</th></tr></thead>
          <tbody className="divide-y divide-border-subtle">{data!.map((s) => (
            <tr key={s.id} className="transition hover:bg-overlay/50">
              <td className="px-6 py-4 font-medium text-text-primary">{show(s.title)}</td>
              <td className="px-6 py-4 text-small text-text-muted">{s.order}</td>
              <td className="px-6 py-4"><div className="flex items-center justify-end gap-2">
                <button onClick={()=>openEdit(s)} className="rounded-md p-2 text-text-muted hover:bg-overlay hover:text-accent"><Pencil className="h-4 w-4" /></button>
                <button onClick={()=>{ if(confirm("Slayt silinsin mi?")) delMut.mutate(s.id); }} className="rounded-md p-2 text-text-muted hover:bg-overlay hover:text-danger"><Trash2 className="h-4 w-4" /></button>
              </div></td></tr>))}</tbody></table>}
      </div>
      <Modal open={open} onClose={()=>setOpen(false)} title={editing?"Slaytı düzenle":"Yeni slayt"} wide
        footer={<><Button variant="secondary" onClick={()=>setOpen(false)}>Vazgeç</Button>
          <Button onClick={()=>{ setError(null); saveMut.mutate(); }} disabled={saveMut.isPending}>{saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{editing?"Kaydet":"Oluştur"}</Button></>}>
        <div className="space-y-5">
          {error && <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-small text-danger">{error}</div>}
          <LocalizedInput label="Başlık" value={form.title} onChange={(v)=>setForm({...form,title:v})} />
          <LocalizedInput label="Alt başlık" value={form.subtitle} onChange={(v)=>setForm({...form,subtitle:v})} textarea />
          <ImageUpload label="Görsel (zorunlu)" value={form.image} onChange={(url)=>setForm({...form,image:url})} />
          <div className="flex items-end gap-6">
            <div className="flex-1"><label className="mb-2 block text-small text-text-muted">CTA bağlantısı</label>
              <input className={fieldInput} value={form.ctaHref} onChange={(e)=>setForm({...form,ctaHref:e.target.value})} placeholder="/teklif" /></div>
            <div className="w-28"><label className="mb-2 block text-small text-text-muted">Sıra</label>
              <input type="number" className={fieldInput} value={form.order} onChange={(e)=>setForm({...form,order:Number(e.target.value)})} /></div>
            <label className="mb-2.5 flex items-center gap-2 text-small text-text-muted">
              <input type="checkbox" checked={form.visible} onChange={(e)=>setForm({...form,visible:e.target.checked})} /> Görünür</label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
