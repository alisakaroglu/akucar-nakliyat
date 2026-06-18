import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ServicesGrid } from "./ServicesGrid";

export function Services() {
  const t = useTranslations("services");

  return (
    <section className="py-30">
      <Container>
        <Reveal>
          <span className="overline">{t("overline")}</span>
          <h2 className="mt-3 font-display text-h2 font-semibold">{t("title")}</h2>
        </Reveal>
        <div className="mt-12">
          <ServicesGrid />
        </div>
      </Container>
    </section>
  );
}
