import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import MaterialsHero from "../components/materials/MaterialsHero";
import MaterialsManifest from "../components/materials/MaterialsManifest";
import MaterialsNavigator from "../components/materials/MaterialsNavigator";
import MaterialsRecords from "../components/materials/MaterialsRecords";
import MaterialsMatrix from "../components/materials/MaterialsMatrix";
import MaterialsProcess from "../components/materials/MaterialsProcess";
import MaterialsLimits from "../components/materials/MaterialsLimits";
import MaterialsClose from "../components/materials/MaterialsClose";

export const metadata: Metadata = {
  title: "Материалы — возможности, доказанные проектами | STRUKTURA",
  description:
    "Не каталог поставщика, а карта инженерных возможностей материалов в архитектуре. 29 материалов в 6 семействах, предельные технологии и проекты-доказательства: металл, стекло, камень, композиты через расчёт, прототипирование и производство.",
};

export default function MaterialsPage() {
  return (
    <>
      <Nav />
      <main>
        {/* [01] HERO — dark */}
        <MaterialsHero />
        {/* [02] МАНИФЕСТ — dark */}
        <MaterialsManifest />
        {/* [03] НАВИГАТОР — вход в каталог возможностей — light */}
        <MaterialsNavigator />
        {/* [04] МАТЕРИАЛЫ НА ПРЕДЕЛЕ — dark */}
        <MaterialsRecords />
        {/* [05] МАТРИЦА — dark */}
        <MaterialsMatrix />
        {/* [07] ИНЖЕНЕРНЫЙ ПРОЦЕСС — light */}
        <MaterialsProcess />
        {/* [08] КАРТА ПРЕДЕЛОВ — dark */}
        <MaterialsLimits />
        {/* [09] ИТОГ + CTA — orange */}
        <MaterialsClose />
      </main>
      <Footer />
    </>
  );
}
