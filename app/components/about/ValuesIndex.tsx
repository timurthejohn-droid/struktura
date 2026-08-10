"use client";

import { useState } from "react";

export type Value = {
  number: string;
  title: string;
  description: string;
  practice: string;
};

/**
 * Раскрывающийся индекс из референс-кита: активная строка подсвечивается,
 * заголовок вырастает, тело раскрывается через grid-template-rows.
 */
export default function ValuesIndex({ values }: { values: Value[] }) {
  const [open, setOpen] = useState(0);

  return (
    <div className="border-t border-black/10">
      {values.map((value, index) => {
        const on = open === index;
        return (
          <div
            key={value.number}
            className={`idx-row border-b border-black/10 ${on ? "bg-orange/[0.05]" : ""}`}
          >
            <button
              type="button"
              onClick={() => setOpen(on ? -1 : index)}
              aria-expanded={on}
              className="grid w-full grid-cols-[42px_1fr_28px] items-center gap-4 py-6 text-left md:grid-cols-[92px_1fr_40px] md:gap-10 md:py-8"
            >
              <span
                className="font-mono text-[12px] transition-colors"
                style={{ color: on ? "var(--orange)" : "rgba(26,26,26,0.35)" }}
              >
                {value.number}
              </span>
              <span
                className="font-mono uppercase leading-[1.08] text-ink transition-all duration-300"
                style={{ fontSize: on ? "clamp(22px,2.9vw,42px)" : "clamp(19px,2.2vw,32px)" }}
              >
                {value.title}
              </span>
              <span
                className="idx-sign justify-self-end font-mono text-[20px] leading-none"
                style={{ color: on ? "var(--orange)" : "rgba(26,26,26,0.3)" }}
                aria-hidden
              >
                +
              </span>
            </button>

            <div className="idx-body">
              <div>
                <div className="grid gap-6 pb-9 md:grid-cols-[92px_0.9fr_1fr] md:gap-10 md:pb-12">
                  <span aria-hidden className="hidden md:block" />
                  <p className="font-body text-[clamp(16px,1.35vw,20px)] leading-[1.55] text-ink/75">
                    {value.description}
                  </p>
                  <p className="border-l border-orange pl-5 font-body text-[14px] leading-[1.6] text-ink/55">
                    <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.14em] text-ink">
                      На практике
                    </span>
                    {value.practice}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
