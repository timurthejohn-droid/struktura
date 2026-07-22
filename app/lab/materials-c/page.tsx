import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import SectionHead from "../../components/SectionHead";
import MaterialsHero from "../../components/materials/MaterialsHero";
import Reveal from "../../components/materials/Reveal";
import MaterialsGrid from "../../components/materials/MaterialsGrid";
import LabBar from "../../components/materials/LabBar";

export const metadata: Metadata = {
  title: "ЛАБ · Вариант C — сетка материалов с фильтром возможностей | STRUKTURA",
  robots: { index: false, follow: false },
};

export default function LabMaterialsC() {
  return (
    <>
      <Nav />
      <LabBar
        variant="C"
        title="Сетка материалов, возможности — фильтр"
        desc="Один объект вместо двух каталогов: материалы видно сразу, возможности работают как фильтр над сеткой. Архитектор заходит и видит материалы, не изучая логику раздела. Обе дороги ведут в одну карточку."
        others={[
          { href: "/lab/materials-d", label: "Вариант D →" },
          { href: "/lab/materials-a", label: "Вариант A →" },
          { href: "/lab/materials-b", label: "Вариант B →" },
        ]}
      />
      <main>
        <MaterialsHero />

        <section id="catalog" className="py-24 md:py-36" style={{ background: "var(--coal)" }}>
          <div className="container-x">
            <SectionHead index="02" kicker="Материалы" theme="dark" />
            <Reveal>
              <p
                className="font-body text-white/60 max-w-2xl mb-12"
                style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}
              >
                Двадцать девять материалов, с&nbsp;которыми мы&nbsp;работаем. Знаете
                материал&nbsp;— откройте карточку. Знаете задачу&nbsp;— нажмите возможность,
                и&nbsp;останутся только те, кто её&nbsp;решает.
              </p>

              <MaterialsGrid />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
