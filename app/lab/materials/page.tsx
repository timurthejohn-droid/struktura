import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import MaterialsTeaser from "../../components/materials/MaterialsTeaser";

// [LAB] Тестовая страница блока «Материалы» для главной.
// Здесь обкатываем scroll-story, потом переносим блок на главную.

export const metadata: Metadata = {
  title: "LAB · Блок «Материалы» — STRUKTURA",
  robots: { index: false },
};

export default function MaterialsLabPage() {
  return (
    <>
      <Nav />
      <main style={{ background: "var(--coal)" }}>
        <MaterialsTeaser />
      </main>
      <Footer />
    </>
  );
}
