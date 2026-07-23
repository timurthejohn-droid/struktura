import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import MaterialsCatalogHead from "../../components/materials/MaterialsCatalogHead";
import Reveal from "../../components/materials/Reveal";
import UnifiedExplorer from "../../components/materials/UnifiedExplorer";
import LabBar from "../../components/materials/LabBar";
import ScrollProgress from "../../components/kit/ScrollProgress";

export const metadata: Metadata = {
  title: "ЛАБ · Вариант D — вход крупными вкладками | STRUKTURA",
  robots: { index: false, follow: false },
};

export default function LabMaterialsD() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <LabBar
        variant="D"
        title="Вариант A с явным выбором входа"
        desc="Тот же каталог, что в A, но переключатель перестал быть чипом: два крупных входа во всю ширину, каждый объясняет, кому он нужен. Продающий Hero заменён рабочей шапкой — каталог начинается на первом экране."
        others={[
          { href: "/lab/materials-a", label: "Вариант A →" },
          { href: "/lab/materials-c", label: "Вариант C →" },
          { href: "/lab/materials-b", label: "Вариант B →" },
        ]}
      />
      <main>
        {/* Шапка вместо Hero: назвать раздел и уйти с дороги */}
        <MaterialsCatalogHead />

        {/* Каталог начинается сразу — без второго заголовка и второго вступления */}
        <section id="navigator" className="pt-10 md:pt-14 pb-24 md:pb-32" style={{ background: "var(--paper)" }}>
          <div className="container-x">
            <Reveal>
              <UnifiedExplorer entry="capability" toggle tabs />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
