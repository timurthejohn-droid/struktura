import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ProjectsSlider from "./components/ProjectsSlider";
import TrustStrip from "./components/TrustStrip";
import IntroBlock from "./components/IntroBlock";
import ProblemsBlock from "./components/ProblemsBlock";
import AlgoPrinciples from "./components/AlgoPrinciples";
import DigitalEnvFlow from "./components/DigitalEnvFlow";
import DigitalEnvHologram from "./components/DigitalEnvHologram";
import MaterialsHome from "./components/materials/MaterialsHome";
import SubsystemsHomeTeaser from "./components/SubsystemsHomeTeaser";
import IpdBlock from "./components/IpdBlock";
import TeamTeaser from "./components/TeamTeaser";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export function Home({ lightCopy = false }: { lightCopy?: boolean }) {
  return (
    <div className={lightCopy ? "home-copy-theme" : undefined}>
      <Nav />
      <main>
        {/* LIGHT */}
        <Hero />
        <ProjectsSlider />
        <TrustStrip />
        <IntroBlock />
        {/* DARK */}
        <ProblemsBlock />
        {/* ORANGE — core */}
        <div id="algo">
          <AlgoPrinciples />
        </div>
        {/* DARK */}
        {lightCopy ? <DigitalEnvFlow light /> : <DigitalEnvHologram />}
        {/* DARK — блок «Материалы»: текст слева + видео справа */}
        <MaterialsHome />
        {/* LIGHT */}
        <SubsystemsHomeTeaser />
        {/* LIGHT */}
        <IpdBlock light />
        {/* LIGHT */}
        <TeamTeaser />
        <ContactForm />
      </main>
      {/* DARK */}
      <Footer />
    </div>
  );
}

export default Home;
