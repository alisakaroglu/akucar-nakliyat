import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getNews } from "@/lib/content";
import { formatDate } from "@/lib/format";

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "news" });
  return buildMetadata({ locale, title: t("title"), description: t("lead"), path: "/haberler" });
}

export default async function NewsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const posts = await getNews(locale);

  return (
    <>
      <PageHeader overline={t("overline")} title={t("title")} description={t("lead")} />

      <section className="py-20 md:py-30">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <Link
                  href={`/haberler/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-elevated shadow-card transition duration-300 hover:-translate-y-1 hover:border-accent/60"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-overlay">
                    {p.coverImage && (
                      <Image
                        src={p.coverImage}
                        alt={p.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-elevated via-elevated/20 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <time className="text-overline uppercase text-text-faint">
                      {formatDate(p.date, locale)}
                    </time>
                    <h3 className="mt-4 font-display text-h4 font-medium">{p.title}</h3>
                    <p className="mt-3 flex-1 text-body text-text-muted">{p.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-small text-accent">
                      {t("readMore")}
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
