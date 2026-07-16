import Nav from "./components/Nav";
import Hero from "./components/Hero";
import ProjectsSlider from "./components/ProjectsSlider";
import TrustStrip from "./components/TrustStrip";
import IntroBlock from "./components/IntroBlock";
import ProblemsBlock from "./components/ProblemsBlock";
import AlgoPrinciples from "./components/AlgoPrinciples";
import DigitalEnvFlow from "./components/DigitalEnvFlow";
import MaterialsBlock from "./components/MaterialsBlock";
import Subsystems from "./components/Subsystems";
import IpdBlock from "./components/IpdBlock";
import TeamTeaser from "./components/TeamTeaser";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
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
        <DigitalEnvFlow />
        {/* LIGHT */}
        <MaterialsBlock />
        {/* DARK */}
        <Subsystems />
        {/* ORANGE */}
        <IpdBlock />
        {/* LIGHT */}
        <TeamTeaser />
        <ContactForm />
      </main>
      {/* DARK */}
      <Footer />
    </>
  );
}
