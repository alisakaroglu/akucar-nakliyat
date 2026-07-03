"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2, Loader2, Route as RouteIcon } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Modal, Button, LocalizedInput, fieldInput } from "@/components/admin/ui";

type Loc = { tr?: string; en?: string; ar?: string };
type Route = { id: string; fromCity: Loc; toCity: Loc; order: number; visible: boolean };

const show = (l?: Loc) => l?.tr || l?.en || l?.ar || "—";
const empty = { fromCity: {} as Loc, toCity: {} as Loc, order: 0, visible: true };

export default function RoutesAdminPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Route | null>(null);
  const [form, setForm] = useState<typeof empty>(empty);
  const [error, setError] = useState<string | null>(null);

  const { data: routes, isLoading } = useQuery({
    queryKey: ["admin-routes"],
    queryFn: () => apiFetch<Route[]>("/api/admin/routes"),
  });
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-routes"] });

  const saveMut = useMutation({
    mutationFn: async () => {
      const payload = { ...form, order: Number(form.order) || 0 };
      if (editing) return apiFetch(`/api/routes/${editing.id}`, { method: "PUT", body: JSON.stringify(payload) });
      return apiFetch("/api/routes", { method: "POST", body: JSON.stringify(payload) });
    },
    onSuccess: () => { invalidate(); setOpen(false); },
    onError: (e) => setError(e instanceof Error ? e.message : "Hata"),
  });
  const delMut = useMutation({
    mutationFn: (id: string) => apiFetch(`/api/routes/${id}`, { method: "DELETE" }),
    onSuccess: invalidate,
  });

  function openNew() { setEditing(null); setForm(empty); setError(null); setOpen(true); }
  function openEdit(r: Route) {
    setEditing(r);
    setForm({ fromCity: r.fromCity ?? {}, toCity: r.toCity ?? {}, order: r.order, visible: r.visible });
    setError(null); setOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">Güzergahlar</h1>
          <p className="mt-1 text-body text-text-muted">Teklif formunda gösterilecek hazır güzergahları yönetin.</p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4" /> Yeni güzergah</Button>
      </div>

      <div className="overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card">
        {isLoading ? (
          <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-accent" /></div>
        ) : (routes?.length ?? 0) === 0 ? (
          <p className="px-6 py-12 text-center text-small text-text-faint">Henüz güzergah yok. “Yeni güzergah” ile ekleyin.</p>
        ) : (
          <table className="w-full text-start">
            <thead>
              <tr className="border-b border-border-subtle text-overline uppercase text-text-faint">
                <th className="px-6 py-3 text-start font-medium">Güzergah</th>
                <th className="px-6 py-3 text-start font-medium">Sıra</th>
                <th className="px-6 py-3 text-start font-medium">Durum</th>
                <th className="px-6 py-3 text-end font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {routes!.map((r) => (
                <tr key={r.id} className="transition hover:bg-overlay/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <RouteIcon className="h-4 w-4 text-text-faint" />
                      <span className="font-medium text-text-primary">{show(r.fromCity)} → {show(r.toCity)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-small text-text-muted">{r.order}</td>
                  <td className="px-6 py-4">
                    <span className={[
                      "rounded-full px-2.5 py-0.5 text-overline uppercase",
                      r.visible ? "bg-success/15 text-success" : "bg-overlay text-text-faint",
                    ].join(" ")}>{r.visible ? "Görünür" : "Gizli"}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(r)} aria-label="Düzenle" className="rounded-md p-2 text-text-muted transition hover:bg-overlay hover:text-accent"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => { if (confirm(`“${show(r.fromCity)} → ${show(r.toCity)}” silinsin mi?`)) delMut.mutate(r.id); }} aria-label="Sil" className="rounded-md p-2 text-text-muted transition hover:bg-overlay hover:text-danger"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Güzergahı düzenle" : "Yeni güzergah"} wide
        footer={<>
          <Button variant="secondary" onClick={() => setOpen(false)}>Vazgeç</Button>
          <Button onClick={() => { setError(null); saveMut.mutate(); }} disabled={saveMut.isPending}>
            {saveMut.isPending && <Loader2 className="h-4 w-4 animate-spin" />}{editing ? "Kaydet" : "Oluştur"}
          </Button>
        </>}>
        <div className="space-y-5">
          {error && <div className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-small text-danger">{error}</div>}
          <LocalizedInput label="Nereden" value={form.fromCity} onChange={(v) => setForm({ ...form, fromCity: v })} placeholder="Hatay" />
          <LocalizedInput label="Nereye" value={form.toCity} onChange={(v) => setForm({ ...form, toCity: v })} placeholder="Beyrut" />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-2 block text-small text-text-muted">Sıra</label>
              <input type="number" className={fieldInput} value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} />
            </div>
            <div>
              <label className="mb-2 block text-small text-text-muted">Durum</label>
              <select className={fieldInput} value={form.visible ? "1" : "0"} onChange={(e) => setForm({ ...form, visible: e.target.value === "1" })}>
                <option value="1">Görünür</option>
                <option value="0">Gizli</option>
              </select>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
