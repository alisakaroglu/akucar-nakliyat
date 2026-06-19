"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, FileText, ExternalLink } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Modal, Button, LocalizedInput, fieldInput } from "@/components/admin/ui";

type Loc = { tr?: string; en?: string; ar?: string };
type Page = {
  id: string; slug: string; title: Loc; body: Loc;
  seoTitle?: Loc; seoDesc?: Loc; status: "DRAFT" | "PUBLISHED";
};

const show = (l?: Loc) => l?.tr || l?.en || l?.ar || "—";
const empty = {
  slug: "", title: {} as Loc, body: {} as Loc, seoTitle: {} as Loc, seoDesc: {} as Loc, status: "DRAFT" as "DRAFT" | "PUBLISHED",
};

export default function PagesAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Page | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["admin-pages"], queryFn: () => apiFetch<Page[]>("/api/admin/pages") });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-pages"] });

  const saveMut = useMutation({
    mutationFn: async () => {
      if (editing) return apiFetch(`/api/pages/${editing.id}`, { method: "PUT", body: JSON.stringify(form) });
      return apiFetch("/api/pages", { method: "POST", body: JSON.stringify(form) });
    },
    onSuccess: () => { invalidate(); setOpen(false); },
    onError: (e) => setError(e instanceof Error ? e.message : "Hata"),
  });
  const delMut = useMutation({ mutationFn: (id: string) => apiFetch(`/api/pages/${id}`, { method: "DELETE" }), onSuccess: invalidate });

  function openNew() { setEditing(null); setForm(empty); setError(null); setOpen(true); }
  function openEdit(p: Page) {
    setEditing(p);
    setForm({ slug: p.slug, title: p.title ?? {}, body: p.body ?? {}, seoTitle: p.seoTitle ?? {}, seoDesc: p.seoDesc ?? {}, status: p.status });
    setError(null); setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">Dinamik Sayfalar</h1>
          <p className="mt-1 text-body text-text-muted">Panelden yeni sayfa oluşturun (başlık, içerik, SEO).</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Yeni sayfa</Button>
      </div>

      <div className="rounded-md border border-border-subtle bg-accent-soft/40 px-4 py-3 text-small text-text-muted">
        Not: Oluşturulan sayfaların canlı sitede `/&lt;dil&gt;/&lt;slug&gt;` adresinden yayınlanması ve menüye bağlanması
        site–panel entegrasyonu (Faz 2.5) adımında etkinleşecek.
      </div>

      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : (data?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center"><FileText className="h-8 w-8 text-text-faint" /><p className="mt-3 text-small text-text-faint">Henüz sayfa yok. “Yeni sayfa” ile ekleyin.</p></div>
        ) : (
          <table className="w-full">
            <thead><tr className="border-b border-border-subtle text-overline uppercase text-text-faint">
              <th className="px-6 py-3 text-start font-medium">Başlık</th>
              <th className="px-6 py-3 text-start font-medium">Slug</th>
              <th className="px-6 py-3 text-start font-medium">Durum</th>
              <th className="px-6 py-3 text-end font-medium">İşlem</th>
            </tr></thead>
            <tbody className="divide-y divide-border-subtle">
              {data!.map((p) => (
                <tr key={p.id} className="transition hover:bg-overlay/50">
                  <td className="px-6 py-4 font-medium text-text-primary">{show(p.title)}</td>
                  <td className="px-6 py-4 text-small text-text-muted">/{p.slug}</td>
                  <td className="px-6 py-4">
                    <span className={["rounded-full px-2.5 py-0.5 text-overline uppercase", p.status === "PUBLISHED" ? "bg-success/15 text-success" : "bg-overlay text-text-faint"].join(" ")}>{p.status === "PUBLISHED" ? "Yayında" : "Taslak"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} aria-label="Düzenle" className="rounded-md p-2 text-text-muted transition hover:bg-overlay hover:text-accent"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm(`“${show(p.title)}” silinsin mi?`)) delMut.mutate(p.id); }} aria-label="Sil" className="rounded-md p-2 text-text-muted transition hover:bg-overlay hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Sayfayı düzenle" : "Yeni sayfa"} wide
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Vazgeç</Button>
          <Button onClick={() => { setError(null); saveMut.mutate(); }} disabled={saveMut.isPending}>{saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Kaydet" : "Oluştur"}</Button>
        </>}>
        <div className="space-y-5">
          {error && <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-small text-danger">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-small text-text-muted">Slug</label>
              <input className={fieldInput} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="hakkimizda-detay" />
            </div>
            <div>
              <label className="mb-2 block text-small text-text-muted">Durum</label>
              <select className={fieldInput} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "DRAFT" | "PUBLISHED" })}>
                <option value="DRAFT">Taslak</option>
                <option value="PUBLISHED">Yayında</option>
              </select>
            </div>
          </div>
          <LocalizedInput label="Başlık" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <LocalizedInput label="İçerik" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea />
          <div className="border-t border-border-subtle pt-5">
            <p className="mb-3 inline-flex items-center gap-2 text-overline uppercase text-text-faint"><ExternalLink className="h-3.5 w-3.5" /> SEO (opsiyonel)</p>
            <div className="space-y-4">
              <LocalizedInput label="SEO başlık" value={form.seoTitle} onChange={(v) => setForm({ ...form, seoTitle: v })} />
              <LocalizedInput label="SEO açıklama" value={form.seoDesc} onChange={(v) => setForm({ ...form, seoDesc: v })} textarea />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
