"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, X } from "lucide-react";
import { getToken } from "@/lib/admin/api";
import { fieldInput } from "./ui";

// Görsel yükleme alanı: önizleme + dosya yükle + manuel URL.
export function ImageUpload({
  label = "Görsel",
  value,
  onChange,
}: {
  label?: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken() ?? ""}` },
        body: fd,
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error((data && data.error) || "Yükleme başarısız");
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <label className="mb-2 block text-small text-text-muted">{label}</label>
      <div className="flex items-start gap-4">
        <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-md border border-border-subtle bg-overlay">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-overline uppercase text-text-faint">
              Görsel yok
            </div>
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Kaldır"
              className="absolute end-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-base/80 text-text-muted hover:text-danger"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-border-subtle px-4 text-small font-medium text-text-primary transition hover:border-accent hover:text-accent disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Yükleniyor…" : "Dosya yükle"}
          </button>
          <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
          <input
            className={fieldInput}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="veya görsel URL yapıştır"
          />
          {error && <p className="text-small text-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
}
