import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import { services } from "./servicesData";

export const metadata: Metadata = {
  title: "Услуги STRUKTURA+ — форматы работы",
  description:
    "Три формата участия STRUKTURA: подсистема, подсистема + панели и комплексная реализация — от инженерной разработки до готового объекта.",
};

const PEEK = 64;

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="bg-coal text-white">
        {/* ── Форматы работы ── */}
        <section className="border-b border-white/10 pt-28 md:pt-36">
          <div className="container-x pb-10 md:pb-14">
            <div className="flex items-center justify-between border-b border-white/12 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                STRUKTURA+ / Услуги
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">
                03 формата
              </span>
            </div>

            <h1
              className="mt-9 font-mono uppercase text-white"
              style={{ fontSize: "clamp(40px, 6.5vw, 96px)", lineHeight: 0.96, letterSpacing: "-0.01em" }}
            >
              Форматы работы
            </h1>
            <p
              className="mt-6 max-w-[640px] font-body text-white/55"
              style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.55 }}
            >
              Три формата участия STRUKTURA — от собственной подсистемы до реализации под ключ.
              Выберите формат под задачу проекта.
            </p>
          </div>
        </section>

        {/* ── Стек карточек услуг ── */}
        <section className="relative bg-coal">
          {services.map((service, index) => (
            <article
              key={service.slug}
              className="relative bg-coal"
              style={{ position: "sticky", top: `calc(78px + ${index * PEEK}px)`, zIndex: index + 1 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group block border-t border-white/15 bg-coal transition-colors hover:bg-[#1c1c1c]"
              >
                <div className="container-x grid min-h-[320px] gap-8 py-12 md:grid-cols-[0.32fr_1fr_0.95fr_auto] md:items-center md:gap-12 md:py-16">
                  <span className="font-body text-[clamp(72px,9vw,132px)] font-semibold leading-[0.8] text-orange">
                    {service.number}
                  </span>

                  <div>
                    <h3 className="font-mono uppercase leading-[1.02] text-white text-[clamp(24px,2.9vw,44px)]">
                      {service.title}
                    </h3>
                    <p className="mt-4 max-w-[460px] font-body text-[15px] leading-[1.5] text-white/80">
                      {service.short}
                    </p>
                  </div>

                  <p className="hidden max-w-[440px] font-body text-[14px] leading-[1.5] text-white/50 lg:block">
                    {service.description}
                  </p>

                  <span className="flex h-12 w-12 items-center justify-center justify-self-end rounded-full border border-white/20 text-[18px] transition-[transform,border-color] duration-300 ease-out group-hover:translate-x-2 group-hover:scale-[1.15] group-hover:border-orange">
                    <span className="inline-block transition-transform duration-300 ease-out group-hover:scale-[1.35]">
                      →
                    </span>
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
