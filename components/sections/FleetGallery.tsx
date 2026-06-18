"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type Item = { src: string; label: string };

export function FleetGallery({ items, typeDesc, closeLabel }: {
  items: Item[];
  typeDesc: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const go = useCallback(
    (dir: number) =>
      setOpen((cur) => (cur === null ? cur : (cur + dir + items.length) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, go]);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setOpen(i)}
            className="group block overflow-hidden rounded-lg border border-border-subtle bg-elevated text-start shadow-card transition hover:-translate-y-1 hover:border-accent/60"
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.src}
                alt={item.label}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base/80 via-base/10 to-transparent" />
            </div>
            <div className="p-6">
              <h3 className="font-display text-h4 font-medium">{item.label}</h3>
              <p className="mt-2 text-small text-text-muted">{typeDesc}</p>
            </div>
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-base/90 backdrop-blur-sm p-4"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            aria-label={closeLabel}
            className="absolute end-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle text-text-primary hover:border-accent hover:text-accent"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); go(-1); }}
            aria-label="prev"
            className="absolute start-4 flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle text-text-primary hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="h-6 w-6 rtl:rotate-180" />
          </button>
          <figure className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-border-subtle">
              <Image src={items[open].src} alt={items[open].label} fill sizes="100vw" className="object-cover" />
            </div>
            <figcaption className="mt-4 text-center font-display text-h4 text-text-primary">
              {items[open].label}
            </figcaption>
          </figure>
          <button
            onClick={(e) => { e.stopPropagation(); go(1); }}
            aria-label="next"
            className="absolute end-4 flex h-11 w-11 items-center justify-center rounded-full border border-border-subtle text-text-primary hover:border-accent hover:text-accent"
          >
            <ChevronRight className="h-6 w-6 rtl:rotate-180" />
          </button>
        </div>
      )}
    </>
  );
}
