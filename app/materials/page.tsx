import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import MaterialsTeaser from "../components/materials/MaterialsTeaser";
import MaterialsCatalogHead from "../components/materials/MaterialsCatalogHead";
import Reveal from "../components/materials/Reveal";
import UnifiedExplorer from "../components/materials/UnifiedExplorer";
import ScrollProgress from "../components/kit/ScrollProgress";

export const metadata: Metadata = {
  title: "Материалы — возможности, доказанные проектами | STRUKTURA",
  description:
    "Не каталог поставщика, а карта инженерных возможностей материалов в архитектуре. 29 материалов в 6 семействах, предельные технологии и проекты-доказательства: металл, стекло, камень, композиты через расчёт, прототипирование и производство.",
};

export default function MaterialsPage() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main>
        {/* [01] SCROLL-STORY — форма → масштаб → кинетика → акустика */}
        <MaterialsTeaser variant="page" />

        {/* [02] КАТАЛОГ (вариант D) — рабочая шапка + вход крупными вкладками */}
        <MaterialsCatalogHead
          eyebrow="Материалы · STRUKTURA+"
          title="Каталог"
          subtitle="Ищите не сплав, а архитектурную возможность: 9 возможностей, 29 материалов и проекты-доказательства."
        />
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
