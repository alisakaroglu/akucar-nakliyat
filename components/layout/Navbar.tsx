"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { LocaleSwitcher } from "./LocaleSwitcher";

// Üst menü. "Kurumsal" açılır alt menüye sahiptir (Biz Kimiz + politika sayfaları).
type NavItem = { key: string; href: string; children?: { key: string; href: string }[] };

const navItems: NavItem[] = [
  { key: "home", href: "/" },
  {
    key: "corporate",
    href: "/kurumsal",
    children: [
      { key: "about", href: "/kurumsal" },
      { key: "vision", href: "/vizyon-ve-misyon" },
      { key: "quality", href: "/kalite-politikamiz" },
      { key: "hr", href: "/insan-kaynaklari-politikamiz" },
      { key: "documents", href: "/belgelerimiz" },
    ],
  },
  { key: "services", href: "/hizmetler" },
  { key: "fleet", href: "/filo" },
  { key: "references", href: "/referanslar" },
  { key: "news", href: "/haberler" },
];

export function Navbar() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href);

  return (
    <header className="sticky top-0 z-50 border-b border-border-subtle/60 bg-base/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between md:h-20">
        <Link href="/" className="flex items-center" aria-label="Akuçar Nakliyat">
          <Image
            src="/logo-trim.png"
            alt="Akuçar Nakliyat"
            width={179}
            height={34}
            priority
            className="h-7 w-auto md:h-8"
          />
        </Link>

        {/* Masaüstü menü */}
        <nav className="hidden items-center gap-7 md:flex">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.key} className="group relative">
                <Link
                  href={item.href}
                  className={[
                    "inline-flex items-center gap-1 text-body transition hover:text-text-primary",
                    isActive(item.href) ? "text-accent" : "text-text-muted",
                  ].join(" ")}
                >
                  {t(item.key)}
                  <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
                </Link>
                {/* Açılır panel */}
                <div className="invisible absolute start-0 top-full pt-3 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="w-64 rounded-lg border border-border-subtle bg-elevated p-2 shadow-card">
                    {item.children.map((c) => (
                      <Link
                        key={c.href + c.key}
                        href={c.href}
                        className={[
                          "block rounded-md px-3 py-2 text-small transition hover:bg-overlay",
                          isActive(c.href) ? "text-accent" : "text-text-muted hover:text-text-primary",
                        ].join(" ")}
                      >
                        {t(c.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.key}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={[
                  "text-body transition hover:text-text-primary",
                  isActive(item.href) ? "text-accent" : "text-text-muted",
                ].join(" ")}
              >
                {t(item.key)}
              </Link>
            )
          )}
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
          <Container className="flex flex-col gap-1 py-6">
            {navItems.map((item) => (
              <div key={item.key}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-body-lg text-text-primary"
                >
                  {t(item.key)}
                </Link>
                {item.children && (
                  <div className="mb-1 ms-3 flex flex-col border-s border-border-subtle ps-3">
                    {item.children
                      .filter((c) => c.href !== item.href)
                      .map((c) => (
                        <Link
                          key={c.href + c.key}
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="py-1.5 text-body text-text-muted"
                        >
                          {t(c.key)}
                        </Link>
                      ))}
                  </div>
                )}
              </div>
            ))}
            <div className="mt-3 flex items-center justify-between border-t border-border-subtle pt-4">
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
