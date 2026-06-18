"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Item = { q: string; a: string };

export function Accordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border-subtle border-y border-border-subtle">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-start"
            >
              <span className="font-display text-h4 font-medium">{item.q}</span>
              <ChevronDown
                className={[
                  "h-5 w-5 shrink-0 text-accent transition-transform duration-300",
                  isOpen ? "rotate-180" : "",
                ].join(" ")}
              />
            </button>
            <div
              className={[
                "grid transition-all duration-300",
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]",
              ].join(" ")}
            >
              <div className="overflow-hidden">
                <p className="max-w-prose text-body text-text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
