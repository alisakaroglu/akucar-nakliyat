"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LocaleSwitcher } from "./LocaleSwitcher";

// Üst menü öğe limiti: maks 6 (tasarım sistemi §4.3 / ROADMAP kuralı).
const navKeys = ["home", "corporate", "services", "fleet", "references"] as const;
const navHref: Record<(typeof navKeys)[number], string> = {
  home: "/",
  corporate: "/kurumsal",
  services: "/hizmetler",
  fleet: "/filo",
  references: "/referanslar",
};

export function Navbar() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle/60 bg-base/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="font-display text-h4 font-semibold tracking-tight">
          AKUÇAR<span className="text-accent">.</span>
        </Link>

        {/* Masaüstü menü */}
        <nav className="hidden items-center gap-8 md:flex">
          {navKeys.map((key) => (
            <Link
              key={key}
              href={navHref[key]}
              aria-current={pathname === navHref[key] ? "page" : undefined}
              className={[
                "text-body transition hover:text-text-primary",
                pathname === navHref[key] ? "text-accent" : "text-text-muted",
              ].join(" ")}
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LocaleSwitcher />
          <Button href="/teklif" size="sm">
            {t("getQuote")}
          </Button>
        </div>

        {/* Mobil tetik */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {/* Mobil menü */}
      {open && (
        <div className="border-t border-border-subtle bg-base md:hidden">
          <Container className="flex flex-col gap-4 py-6">
            {navKeys.map((key) => (
              <Link
                key={key}
                href={navHref[key]}
                onClick={() => setOpen(false)}
                className="text-body-lg text-text-primary"
              >
                {t(key)}
              </Link>
            ))}
            <div className="flex items-center justify-between pt-4">
              <LocaleSwitcher />
              <Button href="/teklif" size="sm" onClick={() => setOpen(false)}>
                {t("getQuote")}
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
