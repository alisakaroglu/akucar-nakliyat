import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { images } from "@/lib/images";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getReferences } from "@/lib/content";

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
  const refs = await getReferences(locale);

  // Panelde referans yoksa placeholder logo kutuları gösterilir.
  const placeholders = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <>
      <PageHeader overline={t("overline")} title={t("title")} description={t("lead")} image={images.hero} />

      <section className="py-20 md:py-30">
        <Container>
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border-subtle bg-border-subtle sm:grid-cols-3 lg:grid-cols-4">
            {refs.length > 0
              ? refs.map((r) => {
                  const inner = r.logoUrl ? (
                    <Image src={r.logoUrl} alt={r.name} width={160} height={80} className="max-h-16 w-auto object-contain opacity-80 transition group-hover:opacity-100" />
                  ) : (
                    <span className="font-display text-h4 text-text-faint transition group-hover:text-text-muted">{r.name}</span>
                  );
                  return r.website ? (
                    <a key={r.id} href={r.website} target="_blank" rel="noopener noreferrer" className="group flex aspect-[3/2] items-center justify-center bg-elevated p-6">
                      {inner}
                    </a>
                  ) : (
                    <div key={r.id} className="group flex aspect-[3/2] items-center justify-center bg-elevated p-6">{inner}</div>
                  );
                })
              : placeholders.map((n) => (
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
