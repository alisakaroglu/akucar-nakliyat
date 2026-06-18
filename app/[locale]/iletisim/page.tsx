import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { images } from "@/lib/images";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Accordion } from "@/components/ui/Accordion";
import { ContactForm } from "@/components/sections/ContactForm";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({ locale, title: t("title"), description: t("lead"), path: "/iletisim" });
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tf = await getTranslations("faq");

  const info = [
    { Icon: MapPin, label: t("info.addressLabel"), value: t("info.address") },
    { Icon: Phone, label: t("info.phoneLabel"), value: t("info.phone") },
    { Icon: Mail, label: t("info.emailLabel"), value: t("info.email") },
    { Icon: Clock, label: t("info.hoursLabel"), value: t("info.hours") },
  ];

  const faqItems = tf.raw("items") as { q: string; a: string }[];

  return (
    <>
      <PageHeader overline={t("overline")} title={t("title")} description={t("lead")} image={images.hero} />

      <section className="py-20 md:py-30">
        <Container className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <div className="space-y-6">
              {info.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent-soft">
                    <Icon className="h-5 w-5 text-accent" aria-hidden />
                  </span>
                  <div>
                    <div className="text-overline uppercase text-text-faint">{label}</div>
                    <div className="mt-1 text-body text-text-primary">{value}</div>
                  </div>
                </div>
              ))}

              {/* Harita — OpenStreetMap embed (anahtar gerektirmez). */}
              <div className="overflow-hidden rounded-lg border border-border-subtle">
                <iframe
                  title={t("mapTitle")}
                  src="https://www.openstreetmap.org/export/embed.html?bbox=36.10%2C36.15%2C36.23%2C36.25&layer=mapnik&marker=36.2023%2C36.1613"
                  loading="lazy"
                  className="h-64 w-full grayscale"
                />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-lg border border-border-subtle bg-elevated p-8 shadow-card">
              <h2 className="font-display text-h3 font-medium">{t("formTitle")}</h2>
              <p className="mt-2 text-body text-text-muted">{t("formDesc")}</p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <Section overline={tf("overline")} title={tf("title")} className="border-t border-border-subtle">
        <Accordion items={faqItems} />
      </Section>
    </>
  );
}
