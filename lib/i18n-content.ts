import { routing } from "@/i18n/routing";

// Panel içeriği çok dilli JSON olarak saklanır: { tr, en, ar }.
export type LocalizedString = { tr?: string; en?: string; ar?: string };
export type LocalizedList = { tr?: string[]; en?: string[]; ar?: string[] };

const order = ["tr", "en", "ar"] as const;

// İstenen dilde değer; yoksa tr → en → ar fallback.
export function pickLocale(
  value: LocalizedString | null | undefined,
  locale: string
): string {
  if (!value) return "";
  const v = value as Record<string, string | undefined>;
  if (v[locale]) return v[locale] as string;
  for (const l of order) if (v[l]) return v[l] as string;
  return "";
}

export function pickLocaleList(
  value: LocalizedList | null | undefined,
  locale: string
): string[] {
  if (!value) return [];
  const v = value as Record<string, string[] | undefined>;
  if (v[locale]?.length) return v[locale] as string[];
  for (const l of order) if (v[l]?.length) return v[l] as string[];
  return [];
}

// Zod tarafı için: en az bir dil dolu olmalı (varsayılan tr).
export const locales = routing.locales;
