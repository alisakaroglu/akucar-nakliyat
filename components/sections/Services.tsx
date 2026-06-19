import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ServicesGrid } from "./ServicesGrid";
import { getServices } from "@/lib/content";

export async function Services({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "services" });
  const items = await getServices(locale);

  return (
    <section className="py-30">
      <Container>
        <Reveal>
          <span className="overline">{t("overline")}</span>
          <h2 className="mt-3 font-display text-h2 font-semibold">{t("title")}</h2>
        </Reveal>
        <div className="mt-12">
          <ServicesGrid items={items} moreLabel={t("more")} />
        </div>
      </Container>
    </section>
  );
}
