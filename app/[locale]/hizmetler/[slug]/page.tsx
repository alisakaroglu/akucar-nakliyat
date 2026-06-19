import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { routing } from "@/i18n/routing";
import { serviceSlugs } from "@/lib/services";
import { getServiceBySlug, getServices } from "@/lib/content";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    serviceSlugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const s = await getServiceBySlug(slug, locale);
  if (!s) return {};
  return buildMetadata({ locale, title: s.title, description: s.intro, path: `/hizmetler/${slug}` });
}

export default async function ServiceDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const service = await getServiceBySlug(slug, locale);
  if (!service) notFound();

  const td = await getTranslations("serviceDetail");
  const tc = await getTranslations("nav");
  const others = (await getServices(locale)).filter((s) => s.slug !== slug);

  return (
    <>
      <PageHeader overline={td("otherTitle")} title={service.title} description={service.intro} image={service.image} />

      <section className="py-20 md:py-30">
        <Container className="grid gap-16 lg:grid-cols-[1.4fr_1fr]">
          <Reveal>
            {service.body && <p className="max-w-prose text-body-lg text-text-muted">{service.body}</p>}
            {service.features && service.features.length > 0 && (
              <ul className="mt-10 space-y-4">
                {service.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden />
                    <span className="text-body">{f}</span>
                  </li>
                ))}
              </ul>
            )}
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-lg border border-border-subtle bg-elevated p-8 shadow-card">
              <h2 className="font-display text-h3 font-medium">{td("ctaTitle")}</h2>
              <p className="mt-3 text-body text-text-muted">{td("ctaDesc")}</p>
              <Button href="/teklif" className="mt-6 w-full">{tc("getQuote")}</Button>
            </div>

            <div className="mt-6 rounded-lg border border-border-subtle bg-elevated p-8">
              <h3 className="overline">{td("otherTitle")}</h3>
              <ul className="mt-4 space-y-2">
                {others.map((s) => (
                  <li key={s.slug}>
                    <Button href={`/hizmetler/${s.slug}`} variant="ghost" size="sm" className="px-0">{s.title}</Button>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
