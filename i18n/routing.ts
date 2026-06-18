import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["tr", "en", "ar"],
  defaultLocale: "tr",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

// RTL diller — layout yönü için tek kaynak.
export const rtlLocales: Locale[] = ["ar"];
export const isRtl = (locale: string) => rtlLocales.includes(locale as Locale);

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
