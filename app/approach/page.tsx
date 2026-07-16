import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ApproachVenn from "../components/ApproachVenn";
import ApproachDetails from "../components/ApproachDetails";

export const metadata: Metadata = {
  title: "Алгоритмический подход — STRUKTURA+",
  description:
    "Собственная методология цифровизации всех этапов проекта: дискретность, детерминированность, конечность, массовость. Точная последовательность действий, которая приводит к предсказуемому результату.",
};

export default function ApproachPage() {
  return (
    <>
      <Nav />
      <main>
        {/* Intro */}
        <section className="pt-36 md:pt-48 pb-16 md:pb-24" style={{ background: "var(--paper)" }}>
          <div className="container-x">
            <span className="eyebrow text-orange">Подход · STRUKTURA+</span>
            <h1
              className="text-ink mt-6"
              style={{ fontSize: "clamp(34px, 6.4vw, 100px)", lineHeight: 0.98, letterSpacing: "-0.01em" }}
            >
              Алгоритмический
              <br />
              подход
            </h1>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-24 mt-14 md:mt-20">
              <p className="font-body text-ink" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.55 }}>
                В&nbsp;основе алгоритмического подхода STRUKTURA&nbsp;— собственная методология
                цифровизации всех этапов проекта. Это точная последовательность действий,
                которая приводит к&nbsp;предсказуемому результату.
              </p>
              <p className="font-body text-ink-soft" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.55 }}>
                STRUKTURA работает со&nbsp;сложными проектами как с&nbsp;системой, где каждый шаг
                имеет своё место, логику и&nbsp;измеримый итог, а&nbsp;все процессы&nbsp;—
                от&nbsp;проектирования до&nbsp;монтажа&nbsp;— связаны в&nbsp;единой цифровой среде.
              </p>
            </div>
          </div>
        </section>

        {/* Scroll-схема: круги → сборка → подписи → залетаем в ядро */}
        <ApproachVenn />

        {/* Принципы, выгоды, вывод, CTA */}
        <ApproachDetails />
      </main>
      <Footer />
    </>
  );
}
