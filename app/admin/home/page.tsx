"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Check } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Button, LocalizedInput, fieldInput } from "@/components/admin/ui";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Loc = { tr?: string; en?: string; ar?: string };
type HomeAbout = { title?: Loc; body?: Loc; image?: string; ctaHref?: string };

export default function HomeAdminPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState<HomeAbout>({ title: {}, body: {}, image: "", ctaHref: "/kurumsal" });
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiFetch<Record<string, HomeAbout | undefined>>("/api/admin/settings"),
  });

  useEffect(() => {
    const h = data?.homeAbout;
    if (h) setForm({ title: h.title ?? {}, body: h.body ?? {}, image: h.image ?? "", ctaHref: h.ctaHref ?? "/kurumsal" });
  }, [data]);

  const saveMut = useMutation({
    mutationFn: () =>
      apiFetch("/api/admin/settings", {
        method: "PUT",
        body: JSON.stringify({ key: "homeAbout", value: form }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">Anasayfa — Kurumsal Tanıtım</h1>
          <p className="mt-1 text-body text-text-muted">Slider altındaki firma tanıtım metni ve görseli (3 dil).</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="inline-flex items-center gap-1 text-small text-success"><Check className="h-4 w-4" /> Kaydedildi</span>}
          <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Kaydet
          </Button>
        </div>
      </div>

      <div className="max-w-3xl space-y-5 rounded-lg border border-border-subtle bg-elevated p-6 shadow-card">
        <LocalizedInput label="Başlık" value={form.title ?? {}} onChange={(v) => setForm({ ...form, title: v })} />
        <LocalizedInput
          label="Metin (paragrafları boş satır ile ayırın)"
          value={form.body ?? {}}
          onChange={(v) => setForm({ ...form, body: v })}
          textarea
        />
        <ImageUpload label="Görsel" value={form.image ?? ""} onChange={(url) => setForm({ ...form, image: url })} />
        <div>
          <label className="mb-2 block text-small text-text-muted">Buton bağlantısı</label>
          <input
            className={fieldInput}
            value={form.ctaHref ?? ""}
            onChange={(e) => setForm({ ...form, ctaHref: e.target.value })}
            placeholder="/kurumsal"
          />
        </div>
      </div>

      <p className="text-small text-text-faint">
        Boş bırakılırsa anasayfada varsayılan (çeviri dosyasındaki) metin gösterilir.
      </p>
    </div>
  );
}
