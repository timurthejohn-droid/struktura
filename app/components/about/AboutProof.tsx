import PartnersPanel from "../PartnersPanel";
import ReviewsSlider from "../ReviewsSlider";
import SectionHead from "../SectionHead";
import TeamTeaser from "../TeamTeaser";

const statistics = [
  {
    value: "15",
    unit: "+",
    label: "Лет опыта в реализации сложных архитектурных объектов",
  },
  {
    value: "50",
    unit: "+",
    label: "Проектов по всей России — от общественных зданий до частных объектов",
  },
  {
    value: "250",
    unit: "+",
    label: "Специалистов в команде архитекторов, инженеров и конструкторов",
  },
  {
    value: ">100000",
    unit: "м²",
    label: "Реализованных решений — фасадов, интерьеров и конструкций",
  },
  {
    value: "98",
    unit: "%",
    label: "Проектов с уникальной геометрией и нестандартными решениями",
  },
  {
    value: "1",
    unit: "платформа",
    label: "Единая цифровая система управления проектом от проектирования до монтажа",
  },
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

export default function AboutProof() {
  return (
    <>
      <section className="bg-coal py-24 md:py-36">
        <div className="container-x">
          <SectionHead index="07" kicker="Опыт в цифрах" theme="dark" />
          <div className="grid border-l border-t border-white/15 sm:grid-cols-2 lg:grid-cols-3">
            {statistics.map((item, index) => (
              <div
                key={item.label}
                className="group relative flex min-h-[250px] flex-col overflow-hidden border-b border-r border-white/15 p-6 md:min-h-[290px] md:p-8"
              >
                <span className="font-mono text-[11px] tracking-[0.16em] text-orange">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="mt-auto">
                  <p className="font-mono text-[clamp(45px,5.2vw,76px)] leading-none text-white">
                    {item.value}
                    <span className="ml-2 align-top text-[clamp(16px,1.8vw,26px)] text-white/45">
                      {item.unit}
                    </span>
                  </p>
                  <div className="mt-6 h-px w-10 bg-orange transition-all duration-300 group-hover:w-20" />
                  <p className="mt-5 max-w-[320px] font-body text-[15px] leading-[1.45] text-white/60">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <TeamTeaser index="08" />
      <PartnersPanel partners={partners} index="09" />
      <ReviewsSlider index="10" />
    </>
  );
}
