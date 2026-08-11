import Footer from "../components/Footer";
import Nav from "../components/Nav";
import ContactForm from "../components/ContactForm";
import CasesHero from "../components/projects/CasesHero";
import CasesStack from "../components/projects/CasesStack";
import CasesIndex from "../components/projects/CasesIndex";

export const metadata = {
  title: "Кейсы — STRUKTURA",
  description:
    "Реализованные объекты STRUKTURA: фасады, интерьеры и общественные пространства с уникальной геометрией.",
};

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main className="bg-coal">
        <CasesHero />
        <CasesStack />
        <CasesIndex />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
