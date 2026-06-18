import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Container } from "@/components/ui/Container";

export function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-elevated">
      <Container className="grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="font-display text-h4 font-semibold">
            AKUÇAR<span className="text-accent">.</span>
          </div>
          <p className="mt-4 max-w-prose text-small text-text-muted">
            {t("tagline")}
          </p>
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
            <button
              type="submit"
              className="h-11 shrink-0 rounded-md bg-accent px-4 text-small font-medium text-base transition hover:bg-accent-light"
            >
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
