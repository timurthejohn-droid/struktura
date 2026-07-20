"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

type Partner = { name: string; year: string };

function PartnerLogoPlaceholder() {
  return (
    <div className="flex h-20 w-32 items-center gap-3 border border-black/20 p-3" aria-label="Временная заглушка логотипа">
      <span className="grid h-10 w-10 grid-cols-2 gap-1">
        <span className="bg-ink" />
        <span className="bg-orange" />
        <span className="bg-orange" />
        <span className="bg-ink" />
      </span>
      <span className="font-mono text-[10px] tracking-[0.16em] text-ink/45">LOGO</span>
    </div>
  );
}

export default function PartnersPanel({ partners }: { partners: Partner[] }) {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const partner = partners[active];

  return (
    <section className="bg-paper py-20 md:py-28">
      <div className="container-x border-t border-black/10 pt-10 md:pt-14">
        <div className="grid gap-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-20">
          <aside className="lg:border-r lg:border-black/10 lg:pr-16">
            <div className="relative aspect-square overflow-hidden border border-black/10 p-7 md:p-9">
              <div className="flex h-full flex-col justify-between">
                <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink/45">04 / Партнёры</span>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={partner.name}
                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reducedMotion ? undefined : { opacity: 0, y: -8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                  >
                    <div className="flex flex-col gap-6">
                      <PartnerLogoPlaceholder />
                      <p className="max-w-[250px] font-mono text-[clamp(22px,2vw,34px)] uppercase leading-[1.05] text-ink">{partner.name}</p>
                    </div>
                  </motion.div>
                </AnimatePresence>
                <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-orange">с {partner.year} г.</span>
              </div>
            </div>
          </aside>

          <div
            className="grid grid-cols-2 content-start gap-x-8 gap-y-14 sm:grid-cols-3 md:gap-x-10 md:gap-y-20 lg:grid-cols-4 lg:pt-10"
          >
            {partners.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                className="group min-w-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange focus-visible:outline-offset-4"
                aria-pressed={active === index}
              >
                <p className={`font-mono text-[clamp(16px,1.45vw,22px)] uppercase leading-[1.15] transition-colors ${active === index ? "text-orange" : "text-ink group-hover:text-orange"}`}>{item.name}</p>
                <p className="mt-3 font-body text-[14px] text-ink/40">Партнёр с {item.year} г.</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
