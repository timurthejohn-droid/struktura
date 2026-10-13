import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import VersionSwitcher, { subsystemsVersions } from "../components/VersionSwitcher";
import SubsAlgorithm from "../components/subsystems-v3/SubsAlgorithm";
import SubsCases from "../components/subsystems-v3/SubsCases";
import SubsChain from "../components/subsystems-v3/SubsChain";
import SubsCore from "../components/subsystems-v3/SubsCore";
import SubsEvolution from "../components/subsystems-v3/SubsEvolution";
import SubsFinal from "../components/subsystems-v3/SubsFinal";
import SubsHero from "../components/subsystems-v3/SubsHero";
import SubsMaterials from "../components/subsystems-v3/SubsMaterials";
import SubsPrinciples from "../components/subsystems-v3/SubsPrinciples";
import SubsVerify from "../components/subsystems-v3/SubsVerify";
import "../components/subsystems-v3/subs.css";

// Копия /subsystems по гайду заказчика «Подсистемы STRUKTURA», версия HD v3.
// Основная страница /subsystems не меняется.
export const metadata: Metadata = {
  title: "Подсистемы STRUKTURA",
  description:
    "Подсистема STRUKTURA — собственная инженерная технология: несущая функция, крепление облицовки и её точное позиционирование в одной системе.",
};

export default function SubsystemsCopyPage() {
  return (
    <>
      <Nav />
      <VersionSwitcher versions={subsystemsVersions} />
      <main className="bg-paper">
        <SubsHero />
        <SubsCore />
        <SubsEvolution />
        <SubsPrinciples />
        <SubsAlgorithm />
        <SubsMaterials />
        <SubsChain />
        <SubsCases />
        <SubsVerify />
        <SubsFinal />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
