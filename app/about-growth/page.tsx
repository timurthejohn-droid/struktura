import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import VersionSwitcher, { aboutVersions } from "../components/VersionSwitcher";
import GrowthHero from "../components/about-growth/GrowthHero";
import GrowthTimeline from "../components/about-growth/GrowthTimeline";
import AboutValues from "../components/about-story/AboutValues";

// V3 /about: «История нашего роста». Сразу заголовок и шкала лет, дальше — главы по годам
// из слайда STRUKTURA (проекты + компетенции), склеенные с кейсами сайта и текстами V2.
// После хронологии — то, что не меняется (миссия, философия, команда), как в V2.
export const metadata: Metadata = {
  title: "О компании · История нашего роста — STRUKTURA+",
  description:
    "История STRUKTURA по годам: проекты, на которых компания выросла, и компетенции, которые они дали, — с 2013 года до сегодня.",
};

export default function AboutGrowthPage() {
  return (
    <>
      <Nav />
      <VersionSwitcher versions={aboutVersions} />
      <main>
        <GrowthHero />
        <GrowthTimeline />
        <AboutValues />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
