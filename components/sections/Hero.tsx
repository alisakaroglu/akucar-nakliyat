import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import type { HeroSlideContent } from "@/lib/content";

export function Hero({ slide }: { slide: HeroSlideContent }) {
  const t = useTranslations("hero");

  return (
    <section className="relative overflow-hidden">
      {/* Sinematik arka plan. Tema bütünlüğü için koyu overlay + amber glow. */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={slide.image}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-base/70" />
        <div className="absolute inset-0 bg-amber-glow opacity-50" />
        <div className="absolute inset-0 bg-hero-fade" />
      </div>

      <Container className="relative flex min-h-[88vh] flex-col justify-center py-30">
        <Reveal>
          <span className="overline">{t("overline")}</span>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="mt-4 max-w-prose font-display text-[clamp(2.5rem,8vw,4.209rem)] font-semibold leading-[1.05] tracking-tight">
            {slide.title}
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-prose text-body-lg text-text-muted">
            {slide.subtitle}
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={slide.ctaHref} size="lg">
              {t("ctaPrimary")}
            </Button>
            <Button href="/hizmetler" size="lg" variant="secondary">
              {t("ctaSecondary")}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
