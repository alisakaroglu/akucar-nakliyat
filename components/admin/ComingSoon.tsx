import { Construction } from "lucide-react";

export function ComingSoon({ title, desc }: { title: string; desc?: string }) {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-h2 font-semibold">{title}</h1>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border-subtle bg-elevated px-6 py-20 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
          <Construction className="h-7 w-7 text-accent" />
        </span>
        <h2 className="mt-6 font-display text-h3 font-medium">Bu modül çok yakında</h2>
        <p className="mt-2 max-w-md text-body text-text-muted">
          {desc ?? "Hizmetler modülüyle aynı kalıpta hazırlanıyor: liste, oluştur/düzenle ve sıralama."}
        </p>
      </div>
    </div>
  );
}
