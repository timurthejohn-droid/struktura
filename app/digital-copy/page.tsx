import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import VersionSwitcher, { digitalVersions } from "../components/VersionSwitcher";
import GridLines from "../components/GridLines";
import CoreStory from "../components/digital/CoreStory";

// Копия /digital: хиро «От проектирования — к среде исполнения» и инфографика
// «Цифровое ядро» на объекте. Основная страница /digital не меняется.
export const metadata: Metadata = {
  title: "Цифровая среда STRUKTURA+ · Цифровое ядро",
  description:
    "Цифровое ядро STRUKTURA: как мы развивали цифровую среду и как она связывает исходные данные, подсистему, производства, логистику и площадку на объекте.",
};

const notes = [
  {
    n: "01",
    title: "От проектирования — к среде исполнения",
    body: [
      "3D-проектирование, алгоритмы, связанные модели, работа с данными сканирования и производственными заданиями. Накопленные инструменты и опыт позволяют браться за более сложные задачи.",
      "Мы развиваем среду от проекта к проекту: уточняем методы, дополняем базу решений, автоматизируем повторяющуюся работу.",
    ],
  },
  {
    n: "02",
    title: "Один объект — общая основа",
    body: [
      "Архитектура, подсистема, производство и площадка связаны данными одного объекта. Изменения рассматриваются вместе с их последствиями для элементов и заданий.",
    ],
  },
];

const [hero, base] = notes;

const links = [
  { href: "/subsystems", label: "Подсистемы" },
  { href: "/approach", label: "Алгоритмический подход" },
  { href: "/ipd", label: "Принципы IPD" },
];

export default function DigitalCopyPage() {
  return (
    <>
      <Nav />
      <VersionSwitcher versions={digitalVersions} />
      <main>
        {/* ───────────── Хиро · От проектирования — к среде исполнения ───────────── */}
        <section className="relative flex min-h-[680px] flex-col overflow-hidden text-white md:min-h-[740px] lg:min-h-[calc(100svh-72px)]" style={{ background: "var(--coal-deep)" }}>
          <GridLines theme="dark" count={5} />
          <div className="container-x relative z-10 flex w-full flex-1 flex-col pb-10 pt-24 md:pb-14 md:pt-28">
            <div className="flex items-center justify-between border-b border-white/15 pb-4 rise-in" style={{ animationDelay: "0.05s" }}>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Цифровая среда STRUKTURA+</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Digital / 01</span>
            </div>

            <div className="flex flex-1 flex-col justify-center py-12 md:py-16">
              <p className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-orange rise-in" style={{ animationDelay: "0.12s" }}>
                {hero.n} · Цифровая среда
              </p>
              <h1
                className="max-w-[1160px] font-mono uppercase text-white rise-in"
                style={{ fontSize: "clamp(38px, 6.4vw, 100px)", lineHeight: 0.96, letterSpacing: "-0.02em", animationDelay: "0.18s" }}
              >
                От проектирования —<br />
                к <span className="text-orange">среде исполнения</span>
              </h1>
              <div className="mt-10 grid max-w-[1100px] gap-6 md:mt-14 md:grid-cols-2 md:gap-12 rise-in" style={{ animationDelay: "0.26s" }}>
                {hero.body.map((p) => (
                  <p key={p.slice(0, 20)} className="font-body text-white/65" style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.55 }}>
                    {p}
                  </p>
                ))}
              </div>
            </div>

            <div className="border-t border-white/15 pt-8 rise-in" style={{ animationDelay: "0.34s" }}>
              <div className="grid items-end gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
                <div className="grid gap-4 md:grid-cols-[auto_1fr] md:gap-8">
                  <span className="font-mono text-[12px] text-orange">{base.n}</span>
                  <div>
                    <h2 className="font-mono uppercase text-white" style={{ fontSize: "clamp(18px, 1.6vw, 24px)", lineHeight: 1.1 }}>
                      {base.title}
                    </h2>
                    <p className="mt-3 max-w-[620px] font-body text-white/55" style={{ fontSize: "clamp(14px, 1.05vw, 16px)", lineHeight: 1.55 }}>
                      {base.body[0]}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {links.map((l, i) => (
                    <Link key={l.href} href={l.href} className={`btn ${i === 0 ? "btn-orange" : "btn-white"}`}>
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────── Цифровая среда: как она связывает объект ───────────── */}
        <CoreStory part={1} />

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
