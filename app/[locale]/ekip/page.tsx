import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { images } from "@/lib/images";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getTeam } from "@/lib/content";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "team" });
  return buildMetadata({ locale, title: t("title"), description: t("lead"), path: "/ekip" });
}

export default async function TeamPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const members = await getTeam(locale);

  return (
    <>
      <PageHeader overline={t("overline")} title={t("title")} description={t("lead")} image={images.corporate} />

      <section className="py-20 md:py-30">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.06}>
                <div className="h-full rounded-lg border border-border-subtle bg-elevated p-8 text-center shadow-card">
                  {m.photoUrl ? (
                    <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full">
                      <Image src={m.photoUrl} alt={m.name} fill sizes="80px" className="object-cover" />
                    </div>
                  ) : (
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent-soft font-display text-h3 text-accent">
                      {m.initials}
                    </div>
                  )}
                  <h3 className="mt-6 font-display text-h4 font-medium">{m.name}</h3>
                  <p className="mt-1 text-small text-text-muted">{m.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
