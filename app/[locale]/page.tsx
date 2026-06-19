import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { ReferenceStrip } from "@/components/sections/ReferenceStrip";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
import { RouteMap } from "@/components/sections/RouteMap";
import { getStats, getHero } from "@/lib/content";

export default async function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const [hero, stats] = await Promise.all([getHero(locale), getStats(locale)]);

  return (
    <>
      <Hero slide={hero} />
      <ReferenceStrip />
      <Stats items={stats} />
      <Services locale={locale} />
      <RouteMap />
    </>
  );
}
