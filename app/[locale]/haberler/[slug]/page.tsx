import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { routing } from "@/i18n/routing";
import { getPost, postSlugs } from "@/lib/news";
import { formatDate } from "@/lib/format";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    postSlugs.map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "news" });
  return buildMetadata({ locale, title: t(`posts.${slug}.title`), description: t(`posts.${slug}.excerpt`), path: `/haberler/${slug}` });
}

export default async function NewsDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();

  const t = await getTranslations("news");

  return (
    <>
      <PageHeader
        overline={formatDate(post.date, locale)}
        title={t(`posts.${slug}.title`)}
      />

      <section className="py-20 md:py-30">
        <Container>
          <Reveal>
            <article className="max-w-prose whitespace-pre-line text-body-lg text-text-muted">
              {t(`posts.${slug}.body`)}
            </article>
          </Reveal>
          <div className="mt-12">
            <Link
              href="/haberler"
              className="inline-flex items-center gap-2 text-small text-accent"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {t("backToList")}
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
