import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import MaterialsHero from "../components/materials/MaterialsHero";
import MaterialsNavigator from "../components/materials/MaterialsNavigator";
import MaterialsProcess from "../components/materials/MaterialsProcess";

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
        {/* [02] НАВИГАТОР — вход в каталог возможностей — light */}
        <MaterialsNavigator />
        {/* [03] ИНЖЕНЕРНЫЙ ПРОЦЕСС — light */}
        <MaterialsProcess />
      </main>
      <Footer />
    </>
  );
}
