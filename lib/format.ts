const localeMap: Record<string, string> = {
  tr: "tr-TR",
  en: "en-US",
  ar: "ar",
};

// Ortak tarih biçimlendirme (DRY) — locale'e duyarlı.
export function formatDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(localeMap[locale] ?? "tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
