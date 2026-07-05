import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getHomeAbout } from "@/lib/content";

// Anasayfa — slider altı kurumsal tanıtım. İçerik admin panelinden (SiteSetting "homeAbout").
export async function HomeAbout({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "homeAbout" });
  const about = await getHomeAbout(locale);
  const paragraphs = about.body.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  return (
    <section className="py-20 md:py-30">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border-subtle bg-overlay shadow-card">
            {about.image && (
              <Image
                src={about.image}
                alt={about.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-base/50 to-transparent" />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <span className="overline">{t("overline")}</span>
          <h2 className="mt-3 font-display text-h2 font-semibold">{about.title}</h2>
          <div className="mt-6 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-body-lg text-text-muted">{p}</p>
            ))}
          </div>
          <Button href={about.ctaHref} className="mt-8">
            {t("cta")}
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
