import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import CapabilityExplorer from "../../components/materials/CapabilityExplorer";
import { CAPABILITIES } from "../../components/materials/materialsData";

// Раздел возможности: /materials/forma, /materials/kinetika, …
// Статический экспорт — все 9 страниц генерируются на билде.

export function generateStaticParams() {
  return CAPABILITIES.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const cap = CAPABILITIES.find((c) => c.slug === params.slug);
  if (!cap) return {};
  return {
    title: `${cap.title} — материалы и решения | STRUKTURA`,
    description: `${cap.desc} Материалы, технологии, наши проекты и мировые кейсы: ${cap.tags}.`,
  };
}

export default function CapabilityPage({ params }: { params: { slug: string } }) {
  const cap = CAPABILITIES.find((c) => c.slug === params.slug);
  if (!cap) notFound();

  return (
    <>
      <Nav />
      <main>
        <section className="pt-32 md:pt-40 pb-20 md:pb-28" style={{ background: "var(--paper)" }}>
          <div className="container-x">
            {/* хлебная крошка + номер раздела */}
            <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
              <Link
                href="/materials#navigator"
                className="font-mono uppercase text-ink-soft hover:text-orange transition-colors"
                style={{ fontSize: 11, letterSpacing: "0.14em" }}
              >
                ← Материалы / Все возможности
              </Link>
              <span className="font-mono text-ink-soft" style={{ fontSize: 12, letterSpacing: "0.1em" }}>
                {cap.n} / 09
              </span>
            </div>

            <h1 className="text-ink" style={{ fontSize: "clamp(32px, 5.4vw, 84px)", lineHeight: 0.98, letterSpacing: "-0.01em" }}>
              {cap.title}
            </h1>
            <div className="grid md:grid-cols-2 gap-6 lg:gap-24 mt-7 mb-12 md:mb-16">
              <p className="font-mono text-orange uppercase" style={{ fontSize: 12, letterSpacing: "0.1em" }}>
                {cap.tags}
              </p>
              <p className="font-body text-ink-soft" style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.55 }}>
                {cap.desc}
              </p>
            </div>

            <CapabilityExplorer capability={cap} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
