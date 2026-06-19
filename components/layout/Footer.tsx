import { useTranslations } from "next-intl";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import type { ContactSettings, SocialSettings } from "@/lib/content";

export function Footer({ contact, social }: { contact?: ContactSettings; social?: SocialSettings }) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  const socials = [
    { href: social?.facebook, Icon: Facebook, label: "Facebook" },
    { href: social?.instagram, Icon: Instagram, label: "Instagram" },
    { href: social?.linkedin, Icon: Linkedin, label: "LinkedIn" },
    { href: social?.x, Icon: Twitter, label: "X" },
  ].filter((s) => s.href);

  return (
    <footer className="border-t border-border-subtle bg-elevated">
      <Container className="grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display text-h4 font-semibold">
            AKUÇAR<span className="text-accent">.</span>
          </div>
          <p className="mt-4 max-w-prose text-small text-text-muted">{t("tagline")}</p>
          {(contact?.phone || contact?.email) && (
            <div className="mt-4 space-y-1 text-small text-text-muted">
              {contact?.phone && <div>{contact.phone}</div>}
              {contact?.email && <a href={`mailto:${contact.email}`} className="hover:text-text-primary">{contact.email}</a>}
            </div>
          )}
          {socials.length > 0 && (
            <div className="mt-4 flex gap-3">
              {socials.map(({ href, Icon, label }) => (
                <a key={label} href={href as string} target="_blank" rel="noopener noreferrer" aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border-subtle text-text-muted transition hover:border-accent hover:text-accent">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        <div>
          <h3 className="overline">{t("corporate")}</h3>
          <ul className="mt-4 space-y-2 text-small text-text-muted">
            <li><Link className="hover:text-text-primary" href="/kurumsal">{tNav("corporate")}</Link></li>
            <li><Link className="hover:text-text-primary" href="/ekip">{tNav("team")}</Link></li>
            <li><Link className="hover:text-text-primary" href="/referanslar">{tNav("references")}</Link></li>
            <li><Link className="hover:text-text-primary" href="/filo">{tNav("fleet")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="overline">{t("services")}</h3>
          <ul className="mt-4 space-y-2 text-small text-text-muted">
            <li><Link className="hover:text-text-primary" href="/hizmetler">{tNav("services")}</Link></li>
            <li><Link className="hover:text-text-primary" href="/haberler">{tNav("news")}</Link></li>
            <li><Link className="hover:text-text-primary" href="/iletisim">{tNav("contact")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="overline">{t("newsletter")}</h3>
          <form className="mt-4 flex gap-2">
            <input
              type="email"
              required
              placeholder={t("newsletterPlaceholder")}
              className="h-11 w-full rounded-md border border-border-subtle bg-overlay px-3 text-small text-text-primary placeholder:text-text-faint focus:border-accent focus:outline-none"
            />
            <button type="submit" className="h-11 shrink-0 rounded-md bg-accent px-4 text-small font-medium text-base transition hover:bg-accent-light">
              {t("subscribe")}
            </button>
          </form>
        </div>
      </Container>

      <div className="border-t border-border-subtle">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-small text-text-faint md:flex-row">
          <span>© {year} Ak Uçar Ulus. Taş. Tic. Ltd. Şti.</span>
          <span>{t("rights")}</span>
        </Container>
      </div>
    </footer>
  );
}
