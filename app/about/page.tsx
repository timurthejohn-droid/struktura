import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import AboutCameraScene from "../components/AboutCameraScene";
import AboutWorkflow from "../components/AboutWorkflow";
import PartnersPanel from "../components/PartnersPanel";
import ReviewsSlider from "../components/ReviewsSlider";
import SectionHead from "../components/SectionHead";

export const metadata: Metadata = {
  title: "О компании — STRUKTURA+",
  description: "STRUKTURA объединяет проектирование, производство и монтаж сложных архитектурных объектов в единую систему.",
};

const ipdSteps = [
  { number: "01", body: "IPD (Integrated Project Delivery) — это модель реализации проекта, в которой заказчик, архитекторы, инженеры, производственные и строительные команды работают как единая интегрированная команда с самого начала." },
  { number: "02", body: "Центром такого подхода становится цифровая платформа STRUKTURA+, где формируется полная модель объекта: от идеи до монтажа." },
  { number: "03", body: "Каждое проектное решение учитывает логику производства, логистики и стройки. Конфликты и потери устраняются ещё на стадии цифрового моделирования. Сроки сокращаются, бюджет контролируется, идея сохраняется без компромиссов." },
  { number: "04", body: "Модель IPD в STRUKTURA не теоретическая. Мы применяем её в работе над десятками сложных объектов. Каждое предположение, алгоритм и инженерное решение прошло проверку в реальных условиях — и доказало свою эффективность." },
];

const statistics = [
  { value: "15", unit: "+", label: "Лет опыта в реализации сложных архитектурных объектов" },
  { value: "50", unit: "+", label: "Проектов по всей России — от общественных зданий до частных объектов" },
  { value: "250", unit: "+", label: "Первоклассных специалистов в команде архитекторов, инженеров и конструкторов" },
  { value: ">100000", unit: "м²", label: "Реализованных решений — фасадов, интерьеров и конструкций" },
  { value: "98", unit: "%", label: "Проектов с уникальной геометрией и нестандартными решениями" },
  { value: "1", unit: "платформа", label: "Единая цифровая система управления проектом от проектирования до монтажа" },
];

const partners = [
  { name: "РМК ГРУПП", year: "2020" },
  { name: "ЛАХТА ЦЕНТР", year: "2019" },
  { name: "СБЕР", year: "2021" },
  { name: "MR GROUP", year: "2020" },
  { name: "ГАЗПРОМ", year: "2018" },
  { name: "VESPER", year: "2022" },
  { name: "АТОМ", year: "2023" },
  { name: "МУЗЕИ КРЕМЛЯ", year: "2020" },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <AboutCameraScene />

        <AboutWorkflow steps={ipdSteps} />

        <section className="bg-coal py-24 md:py-36">
          <div className="container-x">
            <SectionHead index="03" kicker="Опыт в цифрах" theme="dark" />
            <div className="grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-3">
              {statistics.map((item, index) => (
                <div key={item.value} className="group relative flex min-h-[250px] flex-col overflow-hidden border-b border-r border-white/15 p-6 md:min-h-[290px] md:p-8">
                  <span className="font-mono text-[11px] tracking-[0.16em] text-orange">{String(index + 1).padStart(2, "0")}</span>
                  <div className="mt-auto">
                    <p className="whitespace-nowrap font-mono text-[52px] leading-none tracking-[0.01em] text-white sm:text-[64px] md:text-[78px]">
                      {item.value}<span className="ml-1 align-top text-[24px] text-white/45 sm:text-[28px] md:text-[32px]">{item.unit}</span>
                    </p>
                    <div className="mt-6 h-px w-10 bg-orange transition-all duration-300 group-hover:w-20" />
                    <p className="mt-5 max-w-[320px] font-body text-[15px] leading-[1.45] text-white/60">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <PartnersPanel partners={partners} />

        <ReviewsSlider />

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
