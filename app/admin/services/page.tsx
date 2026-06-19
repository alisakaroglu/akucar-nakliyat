"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, GripVertical } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Modal, Button, LocalizedInput, fieldInput } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Loc = { tr?: string; en?: string; ar?: string };
type Service = {
  id: string; slug: string; icon: string | null; order: number;
  status: "DRAFT" | "PUBLISHED";
  title: Loc; desc: Loc; intro?: Loc; body?: Loc; image?: string | null;
};

const show = (l?: Loc) => l?.tr || l?.en || l?.ar || "—";
const empty = {
  slug: "", icon: "", order: 0, status: "PUBLISHED" as "DRAFT" | "PUBLISHED",
  title: {} as Loc, desc: {} as Loc, intro: {} as Loc, body: {} as Loc, image: "",
};

export default function ServicesAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [error, setError] = useState<string | null>(null);

  const { data: services, isLoading } = useQuery({
    queryKey: ["admin-services"],
    queryFn: () => apiFetch<Service[]>("/api/admin/services"),
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-services"] });

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editing) return apiFetch(`/api/services/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      return apiFetch("/api/services", { method: "POST", body: JSON.stringify(payload) });
    },
    onSuccess: () => { invalidate(); setOpen(false); },
    onError: (e) => setError(e instanceof Error ? e.message : "Hata"),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/services/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  function openNew() { setEditing(null); setForm(empty); setError(null); setOpen(true); }
  function openEdit(s: Service) {
    setEditing(s);
    setForm({
      slug: s.slug, icon: s.icon ?? "", order: s.order, status: s.status,
      title: s.title ?? {}, desc: s.desc ?? {}, intro: s.intro ?? {}, body: s.body ?? {}, image: s.image ?? "",
    });
    setError(null); setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">Hizmetler</h1>
          <p className="mt-1 text-body text-text-muted">Hizmet sayfalarını ekleyin, düzenleyin, sıralayın.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Yeni hizmet</Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : (services?.length ?? 0) === 0 ? (
          <p className="px-6 py-12 text-center text-small text-text-faint">Henüz hizmet yok. “Yeni hizmet” ile ekleyin.</p>
        ) : (
          <table className="w-full text-start">
            <thead>
              <tr className="border-b border-border-subtle text-overline uppercase text-text-faint">
                <th className="px-6 py-3 text-start font-medium">Başlık</th>
                <th className="px-6 py-3 text-start font-medium">Slug</th>
                <th className="px-6 py-3 text-start font-medium">Durum</th>
                <th className="px-6 py-3 text-start font-medium">Sıra</th>
                <th className="px-6 py-3 text-end font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {services!.map((s) => (
                <tr key={s.id} className="transition hover:bg-overlay/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-text-faint" />
                      <span className="font-medium text-text-primary">{show(s.title)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-small text-text-muted">/{s.slug}</td>
                  <td className="px-6 py-4">
                    <span className={[
                      "rounded-full px-2.5 py-0.5 text-overline uppercase",
                      s.status === "PUBLISHED" ? "bg-success/15 text-success" : "bg-overlay text-text-faint",
                    ].join(" ")}>{s.status === "PUBLISHED" ? "Yayında" : "Taslak"}</span>
                  </td>
                  <td className="px-6 py-4 text-small text-text-muted">{s.order}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(s)} aria-label="Düzenle" className="rounded-md p-2 text-text-muted transition hover:bg-overlay hover:text-accent"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm(`“${show(s.title)}” silinsin mi?`)) delMut.mutate(s.id); }} aria-label="Sil" className="rounded-md p-2 text-text-muted transition hover:bg-overlay hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Hizmeti düzenle" : "Yeni hizmet"} wide
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Vazgeç</Button>
          <Button onClick={() => { setError(null); saveMut.mutate(); }} disabled={saveMut.isPending}>
            {saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Kaydet" : "Oluştur"}
          </Button>
        </>}>
        <div className="space-y-5">
          {error && <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-small text-danger">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-1">
              <label className="mb-2 block text-small text-text-muted">Slug</label>
              <input className={fieldInput} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="lubnan" />
            </div>
            <div>
              <label className="mb-2 block text-small text-text-muted">İkon (lucide)</label>
              <input className={fieldInput} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Truck" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-2 block text-small text-text-muted">Sıra</label>
                <input type="number" className={fieldInput} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
              </div>
              <div>
                <label className="mb-2 block text-small text-text-muted">Durum</label>
                <select className={fieldInput} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "DRAFT" | "PUBLISHED" })}>
                  <option value="PUBLISHED">Yayında</option>
                  <option value="DRAFT">Taslak</option>
                </select>
              </div>
            </div>
          </div>

          <LocalizedInput label="Başlık" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <LocalizedInput label="Kısa açıklama" value={form.desc} onChange={(v) => setForm({ ...form, desc: v })} textarea />
          <LocalizedInput label="Giriş (detay)" value={form.intro} onChange={(v) => setForm({ ...form, intro: v })} textarea />
          <LocalizedInput label="İçerik (detay gövde)" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea />
          <ImageUpload label="Görsel" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
        </div>
      </Modal>
    </div>
  );
}
