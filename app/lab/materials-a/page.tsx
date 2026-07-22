import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import SectionHead from "../../components/SectionHead";
import MaterialsHero from "../../components/materials/MaterialsHero";
import Reveal from "../../components/materials/Reveal";
import UnifiedExplorer from "../../components/materials/UnifiedExplorer";
import LabBar from "../../components/materials/LabBar";

export const metadata: Metadata = {
  title: "ЛАБ · Вариант A — единый каталог с двумя входами | STRUKTURA",
  robots: { index: false, follow: false },
};

export default function LabMaterialsA() {
  return (
    <>
      <Nav />
      <LabBar
        variant="A"
        title="Единый каталог, два входа"
        desc="Один каталог с тумблером «по возможности ↔ по материалу». Оба входа сходятся в одну и ту же карточку — человек не теряет ориентацию и всегда видит полную картину."
        other={{ href: "/lab/materials-b", label: "Смотреть вариант B →" }}
      />
      <main>
        <MaterialsHero />

        <section id="navigator" className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
          <div className="container-x">
            <SectionHead index="02" kicker="Каталог возможностей" theme="light" />
            <Reveal>
              <p
                className="font-body text-ink-soft max-w-2xl mb-12"
                style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}
              >
                Одни ищут архитектурную возможность и подбирают под неё материал. Другие
                приходят с материалом и хотят понять, что он умеет. Каталог открывается
                с&nbsp;обеих сторон&nbsp;— переключите вход.
              </p>

              <UnifiedExplorer entry="capability" toggle />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
