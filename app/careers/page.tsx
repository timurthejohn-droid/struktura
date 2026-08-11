import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import CareersHero from "../components/careers/CareersHero";
import VacancyList from "../components/careers/VacancyList";
import CareersOffer from "../components/careers/CareersOffer";
import CareersBand from "../components/careers/CareersBand";
import ResumeForm from "../components/careers/ResumeForm";

export const metadata: Metadata = {
  title: "Соискателям — STRUKTURA+",
  description:
    "Открытые вакансии STRUKTURA: архитектор, дизайнер интерьера, сметчик, руководитель проектов. Условия работы и форма отправки резюме.",
};

export default function CareersPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper">
        <CareersHero />
        <VacancyList />
        <CareersOffer />
        <CareersBand />
        <ResumeForm />
      </main>
      <Footer />
    </>
  );
}
