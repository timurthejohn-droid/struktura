import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import SectionHead from "../../components/SectionHead";
import MaterialsHero from "../../components/materials/MaterialsHero";
import MaterialsNavigator from "../../components/materials/MaterialsNavigator";
import Reveal from "../../components/materials/Reveal";
import UnifiedExplorer from "../../components/materials/UnifiedExplorer";
import LabBar from "../../components/materials/LabBar";

export const metadata: Metadata = {
  title: "ЛАБ · Вариант B — два каталога подряд | STRUKTURA",
  robots: { index: false, follow: false },
};

export default function LabMaterialsB() {
  return (
    <>
      <Nav />
      <LabBar
        variant="B"
        title="Два каталога подряд"
        desc="Текущий каталог возможностей остаётся без изменений. Ниже — второй каталог: сначала материал, затем радар его возможностей с проектами, статьями и мировыми кейсами."
        others={[
          { href: "/lab/materials-a", label: "Вариант A →" },
          { href: "/lab/materials-c", label: "Вариант C →" },
        ]}
      />
      <main>
        <MaterialsHero />

        {/* [02] КАТАЛОГ ВОЗМОЖНОСТЕЙ — как на боевой странице, без изменений */}
        <MaterialsNavigator />

        {/* [03] КАТАЛОГ МАТЕРИАЛОВ — обратный вход */}
        <section id="by-material" className="py-24 md:py-36" style={{ background: "var(--paper-card)" }}>
          <div className="container-x">
            <SectionHead index="03" kicker="Каталог материалов" theme="light" />
            <Reveal>
              <p
                className="font-body text-ink-soft max-w-2xl mb-12"
                style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}
              >
                Пришли с&nbsp;конкретным материалом? Возьмите его&nbsp;— и&nbsp;увидите
                профиль возможностей на&nbsp;девяти осях: где материал силён, где работает
                штатно, а&nbsp;где нужен R&amp;D.
              </p>

              <UnifiedExplorer entry="material" toggle={false} />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
