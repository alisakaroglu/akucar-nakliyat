import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { getPageBySlug } from "@/lib/content";

// Panelden oluşturulan dinamik sayfalar (yayınlanmış). Statik route'lar (hizmetler, filo, vb.)
// aynı seviyede öncelikli olduğundan burası yalnızca onların dışındaki slug'ları yakalar.
export const dynamicParams = true;

export async function generateMetadata({ params: { locale, slug } }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const page = await getPageBySlug(slug, locale);
  if (!page) return {};
  return buildMetadata({ locale, title: page.seoTitle || page.title, description: page.seoDesc, path: `/${slug}` });
}

export default async function DynamicPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string };
}) {
  setRequestLocale(locale);
  const page = await getPageBySlug(slug, locale);
  if (!page) notFound();

  return (
    <>
      <PageHeader title={page.title} />
      <section className="py-20 md:py-30">
        <Container>
          <Reveal>
            <article className="max-w-prose whitespace-pre-line text-body-lg text-text-muted">
              {page.body}
            </article>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
