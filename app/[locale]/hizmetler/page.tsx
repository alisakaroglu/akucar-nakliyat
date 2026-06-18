import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { images } from "@/lib/images";
import { Container } from "@/components/ui/Container";
import { ServicesGrid } from "@/components/sections/ServicesGrid";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "services" });
  return buildMetadata({ locale, title: t("title"), description: t("lead"), path: "/hizmetler" });
}

export default async function ServicesPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("services");

  return (
    <>
      <PageHeader overline={t("overline")} title={t("title")} description={t("lead")} image={images.services.middleeast} />
      <section className="py-20 md:py-30">
        <Container>
          <ServicesGrid />
        </Container>
      </section>
    </>
  );
}
