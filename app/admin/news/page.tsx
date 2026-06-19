"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Newspaper } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Modal, Button, LocalizedInput, fieldInput } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Loc = { tr?: string; en?: string; ar?: string };
type Post = {
  id: string; slug: string; title: Loc; excerpt: Loc; body: Loc;
  coverImage?: string | null; category?: string | null;
  publishedAt?: string | null; status: "DRAFT" | "PUBLISHED";
};

const show = (l?: Loc) => l?.tr || l?.en || l?.ar || "—";
const toDateInput = (iso?: string | null) => (iso ? iso.slice(0, 10) : "");
const empty = {
  slug: "", title: {} as Loc, excerpt: {} as Loc, body: {} as Loc,
  coverImage: "", category: "", publishedAt: "", status: "DRAFT" as const,
};

export default function NewsAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [error, setError] = useState<string | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["admin-news"], queryFn: () => apiFetch<Post[]>("/api/admin/news") });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-news"] });

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = { ...form, publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : "" };
      if (editing) return apiFetch(`/api/news/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      return apiFetch("/api/news", { method: "POST", body: JSON.stringify(payload) });
    },
    onSuccess: () => { invalidate(); setOpen(false); },
    onError: (e) => setError(e instanceof Error ? e.message : "Hata"),
  });
  const delMut = useMutation({ mutationFn: (id: string) => apiFetch(`/api/news/${id}`, { method: "DELETE" }), onSuccess: invalidate });

  function openNew() { setEditing(null); setForm(empty); setError(null); setOpen(true); }
  function openEdit(p: Post) {
    setEditing(p);
    setForm({
      slug: p.slug, title: p.title ?? {}, excerpt: p.excerpt ?? {}, body: p.body ?? {},
      coverImage: p.coverImage ?? "", category: p.category ?? "", publishedAt: toDateInput(p.publishedAt), status: p.status,
    });
    setError(null); setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">Haberler</h1>
          <p className="mt-1 text-body text-text-muted">Haber/blog yazılarını oluşturun ve yayınlayın.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Yeni haber</Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : (data?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center px-6 py-16 text-center"><Newspaper className="h-8 w-8 text-text-faint" /><p className="mt-3 text-small text-text-faint">Henüz haber yok. “Yeni haber” ile ekleyin.</p></div>
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Haberi düzenle" : "Yeni haber"} wide
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Vazgeç</Button>
          <Button onClick={() => { setError(null); saveMut.mutate(); }} disabled={saveMut.isPending}>{saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Kaydet" : "Oluştur"}</Button>
        </>}>
        <div className="space-y-5">
          {error && <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-small text-danger">{error}</div>}
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="sm:col-span-2">
              <label className="mb-2 block text-small text-text-muted">Slug</label>
              <input className={fieldInput} value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="suriye-hatti-yeniden" />
            </div>
            <div>
              <label className="mb-2 block text-small text-text-muted">Kategori</label>
              <input className={fieldInput} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <label className="mb-2 block text-small text-text-muted">Durum</label>
              <select className={fieldInput} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as "DRAFT" | "PUBLISHED" })}>
                <option value="DRAFT">Taslak</option>
                <option value="PUBLISHED">Yayında</option>
              </select>
            </div>
          </div>
          <div className="sm:w-1/2">
            <label className="mb-2 block text-small text-text-muted">Yayın tarihi</label>
            <input type="date" className={fieldInput} value={form.publishedAt} onChange={(e) => setForm({ ...form, publishedAt: e.target.value })} />
          </div>
          <ImageUpload label="Kapak görseli" value={form.coverImage} onChange={(url) => setForm({ ...form, coverImage: url })} />
          <LocalizedInput label="Başlık" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
          <LocalizedInput label="Özet" value={form.excerpt} onChange={(v) => setForm({ ...form, excerpt: v })} textarea />
          <LocalizedInput label="İçerik" value={form.body} onChange={(v) => setForm({ ...form, body: v })} textarea />
        </div>
      </Modal>
    </div>
  );
}
