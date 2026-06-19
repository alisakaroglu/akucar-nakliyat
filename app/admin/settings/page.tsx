"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save, Check, MapPin, Share2, Search } from "lucide-react";
import { apiFetch } from "@/lib/admin/api";
import { Button, fieldInput } from "@/components/admin/ui";

type Settings = Record<string, Record<string, string> | undefined>;

const sections = [
  {
    key: "contact", title: "İletişim Bilgileri", Icon: MapPin,
    fields: [
      { name: "address", label: "Adres" },
      { name: "phone", label: "Telefon" },
      { name: "email", label: "E-posta" },
      { name: "whatsapp", label: "WhatsApp (905…)" },
      { name: "hours", label: "Çalışma saatleri" },
    ],
  },
  {
    key: "social", title: "Sosyal Medya", Icon: Share2,
    fields: [
      { name: "facebook", label: "Facebook URL" },
      { name: "instagram", label: "Instagram URL" },
      { name: "linkedin", label: "LinkedIn URL" },
      { name: "x", label: "X (Twitter) URL" },
    ],
  },
  {
    key: "seo", title: "SEO", Icon: Search,
    fields: [
      { name: "siteTitle", label: "Varsayılan başlık" },
      { name: "siteDescription", label: "Varsayılan açıklama" },
    ],
  },
] as const;

export default function SettingsAdminPage() {
  const qc = useQueryClient();
  const [data, setData] = useState<Settings>({});
  const [saved, setSaved] = useState(false);

  const { data: loaded, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: () => apiFetch<Settings>("/api/admin/settings"),
  });

  useEffect(() => { if (loaded) setData(loaded); }, [loaded]);

  const saveMut = useMutation({
    mutationFn: async () => {
      // Üç bölümü de kaydet.
      for (const s of sections) {
        await apiFetch("/api/admin/settings", {
          method: "PUT",
          body: JSON.stringify({ key: s.key, value: data[s.key] ?? {} }),
        });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["settings"] });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    },
  });

  const set = (section: string, name: string, value: string) =>
    setData((d) => ({ ...d, [section]: { ...(d[section] ?? {}), [name]: value } }));

  if (isLoading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="h-7 w-7 animate-spin text-accent" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-h2 font-semibold">Site Ayarları</h1>
          <p className="mt-1 text-body text-text-muted">İletişim bilgileri, sosyal medya ve SEO.</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="inline-flex items-center gap-1 text-small text-success"><Check className="h-4 w-4" /> Kaydedildi</span>}
          <Button onClick={() => saveMut.mutate()} disabled={saveMut.isPending}>
            {saveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Kaydet
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {sections.map(({ key, title, Icon, fields }) => (
          <div key={key} className="rounded-lg border border-border-subtle bg-elevated p-6 shadow-card">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-accent-soft">
                <Icon className="h-5 w-5 text-accent" />
              </span>
              <h2 className="font-display text-h4 font-medium">{title}</h2>
            </div>
            <div className="space-y-4">
              {fields.map((f) => (
                <div key={f.name}>
                  <label className="mb-2 block text-small text-text-muted">{f.label}</label>
                  <input
                    className={fieldInput}
                    value={(data[key]?.[f.name]) ?? ""}
                    onChange={(e) => set(key, f.name, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-small text-text-faint">
        Not: Bu ayarların canlı siteye yansıması (footer, iletişim sayfası) site–panel entegrasyonu adımında bağlanacak.
      </p>
    </div>
  );
}
