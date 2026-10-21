import Nav from "./components/Nav";
import HeroScrollVideo from "./components/hero/HeroScrollVideo";
import ProjectsSlider from "./components/ProjectsSlider";
import TrustStrip from "./components/TrustStrip";
import IntroBlock from "./components/IntroBlock";
import ProblemsBlock from "./components/ProblemsBlock";
import MaterialsSubsystemsHome from "./components/MaterialsSubsystemsHome";
import FormulaBlock from "./components/FormulaBlock";
import TeamTeaser from "./components/TeamTeaser";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export function Home({ lightCopy = false }: { lightCopy?: boolean }) {
  return (
    <div className={lightCopy ? "home-copy-theme" : undefined}>
      <Nav />
      <main>
        {/* LIGHT */}
        {/* Первый экран: ролик раскрывается при скролле */}
        <HeroScrollVideo />
        <ProjectsSlider />
        <TrustStrip />
        <IntroBlock />
        {/* LIGHT — «Материалы» и «Подсистемы» двумя карточками в одну линию */}
        <MaterialsSubsystemsHome />
        {/* DARK */}
        <ProblemsBlock />
        {/* LIGHT — «Формула STRUKTURA+»: подход + цифровая среда + IPD одним блоком */}
        <FormulaBlock />
        {/* LIGHT */}
        <TeamTeaser index="07" />
        <ContactForm />
      </main>
      {/* DARK */}
      <Footer />
    </div>
  );
}

export default Home;
