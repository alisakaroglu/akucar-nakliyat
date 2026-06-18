import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { images } from "@/lib/images";
import { FleetGallery } from "@/components/sections/FleetGallery";

const items = ["tir", "frigo", "lowbed", "konteyner", "tenteli", "parsiyel"];

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "fleet" });
  return buildMetadata({ locale, title: t("title"), description: t("lead"), path: "/filo" });
}

export default async function FleetPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("fleet");

  const gallery = items.map((item) => ({
    src: images.fleet[item],
    label: t(`types.${item}`),
  }));

  return (
    <>
      <PageHeader overline={t("overline")} title={t("title")} description={t("lead")} image={images.fleet.tir} />

      <section className="py-20 md:py-30">
        <Container>
          <FleetGallery items={gallery} typeDesc={t("typeDesc")} closeLabel={t("close")} />
          <p className="mt-10 text-small text-text-faint">{t("note")}</p>
        </Container>
      </section>
    </>
  );
}
