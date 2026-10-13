import type { ReactNode } from "react";

export { default as Reveal } from "./Reveal";

/** Короткий лид секции под SectionHead. */
export function Lead({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p
      className={`-mt-4 mb-12 max-w-[760px] font-body md:-mt-6 md:mb-16 ${dark ? "text-white/60" : "text-ink/60"}`}
      style={{ fontSize: "clamp(16px, 1.3vw, 19px)", lineHeight: 1.5 }}
    >
      {children}
    </p>
  );
}
