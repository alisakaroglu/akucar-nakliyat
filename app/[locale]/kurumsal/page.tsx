import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Eye, Target, Award, Users, FileText } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { images } from "@/lib/images";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "corporate" });
  return buildMetadata({ locale, title: t("title"), description: t("lead"), path: "/kurumsal" });
}

export default async function CorporatePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("corporate");

  const cards = [
    { key: "vision", Icon: Eye },
    { key: "mission", Icon: Target },
    { key: "quality", Icon: Award },
    { key: "hr", Icon: Users },
  ] as const;

  const docs = t.raw("docs.items") as { name: string; desc: string }[];

  return (
    <>
      <PageHeader overline={t("overline")} title={t("title")} description={t("lead")} image={images.corporate} />

      <Section overline={t("aboutOverline")} title={t("aboutTitle")}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <div className="space-y-6">
              <p className="text-body-lg text-text-muted">{t("p1")}</p>
              <p className="text-body-lg text-text-muted">{t("p2")}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border-subtle">
              <Image
                src={images.hero}
                alt={t("aboutTitle")}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base/60 to-transparent" />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="border-t border-border-subtle">
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map(({ key, Icon }, i) => (
            <Reveal key={key} delay={i * 0.08}>
              <div className="h-full rounded-lg border border-border-subtle bg-elevated p-8 shadow-card">
                <Icon className="h-8 w-8 text-accent" aria-hidden />
                <h3 className="mt-6 font-display text-h4 font-medium">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-3 text-body text-text-muted">{t(`${key}.desc`)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section overline={t("docs.overline")} title={t("docs.title")} className="border-t border-border-subtle">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {docs.map((d, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="flex h-full items-start gap-4 rounded-lg border border-border-subtle bg-elevated p-6 shadow-card">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-accent-soft">
                  <FileText className="h-5 w-5 text-accent" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-h4 font-medium">{d.name}</h3>
                  <p className="mt-1 text-small text-text-muted">{d.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-8 text-small text-text-faint">{t("docs.note")}</p>
      </Section>
    </>
  );
}
