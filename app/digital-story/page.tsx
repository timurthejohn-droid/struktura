import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import VersionSwitcher, { digitalVersions } from "../components/VersionSwitcher";
import { DsBenefits, DsEvolution, DsFeedback, DsFinal, DsHero, DsProblem, DsSolution } from "../components/digital-story/StoryBlocks";
import CoreSchemeBlock from "../components/digital-story/CoreSchemeBlock";
import SubsystemSpine from "../components/digital-story/SubsystemSpine";
import ObjectJourney from "../components/digital-story/ObjectJourney";
import "./story.css";

// Классическая версия страницы «Цифровая среда» (от копии /digital-copy):
// та же информация, но дозированно — по блоку на одну мысль, в порядке рассказа.
export const metadata: Metadata = {
  title: "Цифровая среда STRUKTURA+",
  description:
    "Как работает цифровая среда STRUKTURA: одна модель объекта связывает архитектуру, подсистему, производство, логистику и монтаж — от замысла до собранного объекта.",
};

export default function DigitalStoryPage() {
  return (
    <>
      <Nav />
      <VersionSwitcher versions={digitalVersions} />
      <main>
        {/* 00 — о чём страница */}
        <DsHero />
        {/* 01 — проблема: эстафета теряет данные */}
        <DsProblem />
        {/* 02 — решение: общее цифровое ядро */}
        <DsSolution />
        {/* 03 — как мы это построили */}
        <DsEvolution />
        {/* 04 — как устроено ядро (3D-схема) */}
        <CoreSchemeBlock />
        {/* 05 — подсистема */}
        <SubsystemSpine />
        {/* 06 — путь одного объекта */}
        <ObjectJourney />
        {/* 07 — обратная связь с площадки */}
        <DsFeedback />
        {/* 08 — что это даёт */}
        <DsBenefits />
        <DsFinal />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
