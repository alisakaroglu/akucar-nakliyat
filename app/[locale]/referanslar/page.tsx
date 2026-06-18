import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { images } from "@/lib/images";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "references" });
  return buildMetadata({ locale, title: t("title"), description: t("lead"), path: "/referanslar" });
}

export default async function ReferencesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("references");

  // Placeholder logo kutuları — gerçek müşteri logoları panelden/müşteriden gelecek (v2/v3).
  const logos = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <>
      <PageHeader overline={t("overline")} title={t("title")} description={t("lead")} image={images.hero} />

      <section className="py-20 md:py-30">
        <Container>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border-subtle bg-border-subtle sm:grid-cols-3 lg:grid-cols-4">
            {logos.map((n) => (
              <div
                key={n}
                className="flex aspect-[3/2] items-center justify-center bg-elevated text-text-faint transition hover:text-text-muted"
              >
                <span className="font-display text-h4">LOGO</span>
              </div>
            ))}
          </div>
          <Reveal>
            <p className="mt-10 max-w-prose text-small text-text-faint">{t("note")}</p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
