import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import SectionHead from "../../components/SectionHead";
import MaterialsHero from "../../components/materials/MaterialsHero";
import Reveal from "../../components/materials/Reveal";
import UnifiedExplorer from "../../components/materials/UnifiedExplorer";
import LabBar from "../../components/materials/LabBar";

export const metadata: Metadata = {
  title: "ЛАБ · Вариант D — вход крупными вкладками | STRUKTURA",
  robots: { index: false, follow: false },
};

export default function LabMaterialsD() {
  return (
    <>
      <Nav />
      <LabBar
        variant="D"
        title="Вариант A с явным выбором входа"
        desc="Тот же каталог, что в A, но переключатель перестал быть чипом: два крупных входа во всю ширину, каждый объясняет, кому он нужен. Активный срастается с каталогом оранжевой полосой."
        others={[
          { href: "/lab/materials-a", label: "Вариант A →" },
          { href: "/lab/materials-c", label: "Вариант C →" },
          { href: "/lab/materials-b", label: "Вариант B →" },
        ]}
      />
      <main>
        <MaterialsHero />

        <section id="navigator" className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
          <div className="container-x">
            <SectionHead index="02" kicker="Каталог" theme="light" />
            <Reveal>
              <p
                className="font-body text-ink-soft max-w-2xl mb-12"
                style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}
              >
                Каталог открывается с&nbsp;двух сторон. Выберите, откуда заходите&nbsp;—
                дальше обе дороги ведут в&nbsp;одну карточку материала.
              </p>

              <UnifiedExplorer entry="capability" toggle tabs />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
