import { useTranslations } from "next-intl";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";
import { NewsletterForm } from "@/components/sections/NewsletterForm";
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
          <Image
            src="/logo-trim.png"
            alt="Akuçar Nakliyat"
            width={179}
            height={34}
            className="h-8 w-auto"
          />
          <p className="mt-4 max-w-prose text-small text-text-muted">{t("tagline")}</p>
          {(contact?.address || contact?.phone || contact?.email) && (
            <div className="mt-4 space-y-1 text-small text-text-muted">
              {contact?.address && <div className="max-w-prose">{contact.address}</div>}
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
          <NewsletterForm />
        </div>
      </Container>

      {/* Konum haritası */}
      <div className="border-t border-border-subtle">
        <Container className="py-12">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="overline">{t("location")}</h3>
            <a
              href="https://maps.app.goo.gl/MY46gVwFxmen9CWw6"
              target="_blank"
              rel="noopener noreferrer"
              className="text-small text-accent hover:underline"
            >
              {t("directions")}
            </a>
          </div>
          <div className="overflow-hidden rounded-lg border border-border-subtle">
            <iframe
              title="Akuçar Nakliyat — Antakya / Hatay konum haritası"
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d12875.421839048247!2d36.1616918!3d36.218708!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x5a5e8157ccbd1a6e!2zQWt1w6dhciBVbHVzLlRhxZ8uVGljLkx0ZC7FnnRpLg!5e0!3m2!1str!2str!4v1654526969109!5m2!1str!2str"
              width="100%"
              height="320"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="block w-full"
            />
          </div>
        </Container>
      </div>

      <div className="border-t border-border-subtle">
        <Container className="flex flex-col items-center justify-between gap-2 py-6 text-small text-text-faint md:flex-row">
          <span>© {year} Ak Uçar Ulus. Taş. Tic. Ltd. Şti.</span>
          <span>{t("rights")}</span>
        </Container>
      </div>
    </footer>
  );
}
