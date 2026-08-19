import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "../../components/Nav";
import ContactForm from "../../components/ContactForm";
import Footer from "../../components/Footer";
import SectionHead from "../../components/SectionHead";
import { services } from "../servicesData";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const service = services.find((s) => s.slug === params.slug);
  if (!service) return {};
  return {
    title: `${service.title} — услуги STRUKTURA+`,
    description: service.short,
  };
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const index = services.findIndex((s) => s.slug === params.slug);
  if (index === -1) notFound();

  const service = services[index];
  const next = services[(index + 1) % services.length];

  return (
    <>
      <Nav />
      <main className="bg-coal-deep text-white">
        {/* ── HERO ── */}
        <section className="border-b border-white/10">
          <div className="container-x pb-14 pt-28 md:pb-20 md:pt-36">
            <Link
              href="/services"
              className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 transition-colors hover:text-orange"
            >
              ← Все услуги
            </Link>

            <div className="mt-10 grid gap-8 md:grid-cols-[auto_1fr] md:items-start md:gap-14">
              <span className="font-body text-[clamp(72px,10vw,150px)] font-semibold leading-[0.8] text-orange">
                {service.number}
              </span>
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
                  STRUKTURA+ / Формат работы
                </span>
                <h1
                  className="mt-4 font-mono uppercase text-white"
                  style={{ fontSize: "clamp(34px, 5vw, 76px)", lineHeight: 0.98, letterSpacing: "-0.01em" }}
                >
                  {service.title}
                </h1>
              </div>
            </div>

            <p
              className="mt-10 max-w-[860px] font-mono uppercase text-white"
              style={{ fontSize: "clamp(18px, 1.9vw, 30px)", lineHeight: 1.3, letterSpacing: "-0.005em" }}
            >
              {service.short}
            </p>
            <p className="mt-7 max-w-[760px] font-body text-[15px] leading-[1.6] text-white/60 md:text-[16px]">
              {service.description}
            </p>
          </div>
        </section>

        {/* ── 01 Что входит ── */}
        <section className="border-b border-white/10 py-16 md:py-24">
          <div className="container-x">
            <SectionHead index="01" kicker="Что входит" theme="dark" />
            <div className="grid border-l border-t border-white/10 sm:grid-cols-2">
              {service.included.map((item, i) => (
                <div
                  key={item}
                  className="flex min-h-[120px] items-start gap-4 border-b border-r border-white/10 p-6 md:p-8"
                >
                  <span className="font-mono text-[12px] text-orange">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="font-body text-[15px] leading-[1.45] text-white/85">{item}</p>
                </div>
              ))}
            </div>
            {service.note ? (
              <p className="mt-8 max-w-[720px] border-l-2 border-orange/60 pl-5 font-body text-[14px] leading-[1.55] text-white/55">
                {service.note}
              </p>
            ) : null}
          </div>
        </section>

        {/* ── 02 Когда выбирать ── */}
        <section className="border-b border-white/10 py-16 md:py-24">
          <div className="container-x">
            <SectionHead index="02" kicker="Когда выбирать" theme="dark" />
            <p
              className="max-w-[900px] font-mono uppercase text-white"
              style={{ fontSize: "clamp(18px, 2vw, 32px)", lineHeight: 1.28, letterSpacing: "-0.005em" }}
            >
              {service.when}
            </p>
          </div>
        </section>

        {/* ── 03 Как мы работаем ── */}
        <section className="border-b border-white/10 py-16 md:py-24">
          <div className="container-x">
            <SectionHead index="03" kicker="Как мы работаем" theme="dark" />
            <div className="border-t border-white/12">
              {service.process.map((step) => (
                <div
                  key={step.n}
                  className="grid gap-4 border-b border-white/12 py-7 md:grid-cols-[0.14fr_0.34fr_1fr] md:items-baseline md:gap-10 md:py-9"
                >
                  <span className="font-mono text-[12px] text-orange">{step.n}</span>
                  <h3 className="font-mono text-[16px] uppercase text-white md:text-[19px]">
                    {step.label}
                  </h3>
                  <p className="max-w-[620px] font-body text-[14px] leading-[1.55] text-white/60 md:text-[15px]">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Результат + CTA ── */}
        <section className="py-16 md:py-24" style={{ background: "var(--coal)" }}>
          <div className="container-x">
            <div className="flex items-center justify-between border-b border-white/15 pb-5">
              <div className="flex items-center gap-5">
                <span className="font-mono text-[12px] text-orange">04</span>
                <h2 className="font-mono text-[13px] uppercase text-white/55 md:text-[15px]">Результат</h2>
              </div>
              <span className="h-2 w-2 rotate-45 border border-orange" aria-hidden />
            </div>

            <p
              className="max-w-[900px] py-12 font-mono uppercase text-white md:py-16"
              style={{ fontSize: "clamp(22px, 2.6vw, 40px)", lineHeight: 1.18 }}
            >
              {service.result}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-8">
              <Link href="/#contact" className="btn btn-orange">
                Обсудить проект
              </Link>
              <Link
                href={`/services/${next.slug}`}
                className="group inline-flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-white/60 transition-colors hover:text-orange"
              >
                Следующий формат: {next.title}
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-[17px] transition-[transform,border-color] duration-300 ease-out group-hover:translate-x-2 group-hover:scale-[1.15] group-hover:border-orange">
                  <span className="inline-block transition-transform duration-300 ease-out group-hover:scale-[1.35]">
                    →
                  </span>
                </span>
              </Link>
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
