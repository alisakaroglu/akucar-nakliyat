import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/sections/Hero";
import { ReferenceStrip } from "@/components/sections/ReferenceStrip";
import { Stats } from "@/components/sections/Stats";
import { Services } from "@/components/sections/Services";
import { RouteMap } from "@/components/sections/RouteMap";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ReferenceStrip />
      <Stats />
      <Services />
      <RouteMap />
    </>
  );
}
