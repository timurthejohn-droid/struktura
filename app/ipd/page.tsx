import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import IpdDetails from "../components/IpdDetails";

export const metadata: Metadata = {
  title: "IPD — единая система реализации проекта — STRUKTURA",
  description:
    "IPD (Integrated Project Delivery) — способ реализации проекта, при котором заказчик, проектировщики, производство и монтаж работают как одна команда с общей ответственностью и единой цифровой моделью. Так устроена STRUKTURA: одно окно вместо цепочки подрядчиков.",
};

export default function IpdPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Intro */}
        <section className="pt-36 md:pt-48 pb-16 md:pb-24" style={{ background: "var(--paper)" }}>
          <div className="container-x">
            <span className="eyebrow text-orange">IPD · Integrated Project Delivery</span>
            <h1
              className="text-ink mt-6"
              style={{ fontSize: "clamp(30px, 5.2vw, 82px)", lineHeight: 0.98, letterSpacing: "-0.01em" }}
            >
              Одна команда.
              <br />
              Одна модель.
              <br />
              Одна ответственность.
            </h1>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-24 mt-14 md:mt-20">
              <p className="font-body text-ink" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.55 }}>
                IPD (Integrated Project Delivery)&nbsp;— способ реализации проекта, при котором
                заказчик, проектировщики, производство и&nbsp;монтаж работают как одна команда:
                с&nbsp;общей ответственностью и&nbsp;единой цифровой моделью&nbsp;— с&nbsp;первого
                дня, а&nbsp;не по&nbsp;эстафете стадия за&nbsp;стадией.
              </p>
              <p className="font-body text-ink-soft" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.55 }}>
                STRUKTURA работает по&nbsp;этому принципу по&nbsp;умолчанию: проектирование,
                производство и&nbsp;монтаж объединены в&nbsp;одну систему реализации. IPD&nbsp;—
                не&nbsp;отдельная услуга, а&nbsp;то, как устроена компания. «Одно окно» вместо
                цепочки подрядчиков.
              </p>
            </div>
          </div>
        </section>

        {/* Эстафета vs система → 4 опоры → что даёт → CTA */}
        <IpdDetails />
      </main>
      <Footer />
    </>
  );
}
