import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import ServicesFormats from "../components/ServicesFormats";

export const metadata: Metadata = {
  title: "STRUKTURA+ — модели реализации",
  description:
    "Единая адаптивная инженерная система STRUKTURA в трёх моделях реализации: комплексно, совместно с производителем или как самостоятельная подсистема.",
};

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="bg-coal text-white">
        <ServicesFormats />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
