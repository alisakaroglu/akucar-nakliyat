"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter, routing } from "@/i18n/routing";
import { Globe } from "lucide-react";

const labels: Record<string, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
};

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function change(next: string) {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border-subtle px-1 py-1">
      <Globe className="mx-1 h-4 w-4 text-text-muted" aria-hidden />
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => change(loc)}
          disabled={isPending}
          aria-current={loc === locale ? "true" : undefined}
          className={[
            "rounded-full px-2.5 py-1 text-small font-medium transition",
            loc === locale
              ? "bg-accent text-base"
              : "text-text-muted hover:text-text-primary",
          ].join(" ")}
        >
          {labels[loc]}
        </button>
      ))}
    </div>
  );
}
