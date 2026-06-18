import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { images } from "@/lib/images";
import { QuoteForm } from "@/components/sections/QuoteForm";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "quote" });
  return buildMetadata({ locale, title: t("title"), description: t("lead"), path: "/teklif" });
}

export default async function QuotePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("quote");

  return (
    <>
      <PageHeader overline={t("overline")} title={t("title")} description={t("lead")} image={images.hero} />
      <section className="py-20 md:py-30">
        <Container className="max-w-2xl">
          <QuoteForm />
        </Container>
      </section>
    </>
  );
}
