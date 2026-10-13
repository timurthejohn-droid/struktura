import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import VersionSwitcher, { digitalVersions } from "../components/VersionSwitcher";
import Reveal from "../components/materials/Reveal";
import CoreStory from "../components/digital/CoreStory";

// Копия /digital по правкам 08.10.2026: вместо набора блоков — одна развивающаяся
// инфографика «Цифровое ядро». Основная страница /digital не меняется.
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
        <h1 className="sr-only">Цифровая среда STRUKTURA+</h1>

        {/* ───────────── Цифровое ядро: одна история от развития среды до объекта ───────────── */}
        <CoreStory />

        {/* ───────────── Пояснение и переходы ───────────── */}
        <section className="border-t border-white/10 py-20 md:py-28" style={{ background: "var(--coal-deep)" }}>
          <div className="container-x">
            <Reveal className="grid gap-12 md:grid-cols-2 md:gap-0">
              {notes.map((note) => (
                <article key={note.n} className="border-t border-white/15 pt-8 md:pr-12">
                  <span className="font-mono text-[12px] text-orange">{note.n}</span>
                  <h2
                    className="mt-5 max-w-[520px] font-mono uppercase text-white"
                    style={{ fontSize: "clamp(22px, 2.2vw, 34px)", lineHeight: 1.06 }}
                  >
                    {note.title}
                  </h2>
                  {note.body.map((p) => (
                    <p key={p.slice(0, 20)} className="mt-5 max-w-[540px] font-body text-white/60" style={{ fontSize: 16, lineHeight: 1.6 }}>
                      {p}
                    </p>
                  ))}
                </article>
              ))}
            </Reveal>

            <Reveal className="mt-14 flex flex-wrap items-center gap-3 border-t border-white/15 pt-8 md:mt-20">
              {links.map((l, i) => (
                <Link key={l.href} href={l.href} className={`btn ${i === 0 ? "btn-orange" : "btn-white"}`}>
                  {l.label}
                </Link>
              ))}
              <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.14em] text-white/25 md:block">
                STRUKTURA+ DIGITAL
              </span>
            </Reveal>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
