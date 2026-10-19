import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import PartnersPanel from "../components/PartnersPanel";
import ReviewsSlider from "../components/ReviewsSlider";
import SectionHead from "../components/SectionHead";
import VersionSwitcher, { aboutVersions } from "../components/VersionSwitcher";
import TeamShowcase from "../components/about/TeamShowcase";
import More from "../components/about-story/More";
import StoryTimeline from "../components/about-story/StoryTimeline";
import {
  cultureParagraphs,
  mission,
  partners,
  philosophyLead,
  philosophyParagraphs,
  principleLead,
  principleParagraphs,
  storyChapters,
  teamParagraphs,
  teamQualities,
} from "../components/about-story/storyData";
import Reveal from "../components/materials/Reveal";

// Копия /about: страница рассказана как история компании по годам.
// Хронология — главы с кейсами и шагами в развитии процесса; длинный текст — под «+».
// Миссия, философия, команда — вне хронологии, после истории. Основная /about не меняется.
export const metadata: Metadata = {
  title: "О компании · История — STRUKTURA+",
  description:
    "История STRUKTURA по годам: от первых нестандартных объектов к алгоритмическому подходу, цифровой среде STRUKTURA+ и собственным подсистемам.",
};

export default function AboutCopyPage() {
  return (
    <>
      <Nav />
      <VersionSwitcher versions={aboutVersions} />
      <main>
        {/* ───────────── HERO ───────────── */}
        <section className="bg-coal text-white">
          <div className="container-x">
            <div className="grid min-h-[92vh] content-end gap-14 pb-16 pt-40 md:pb-20 md:pt-48">
              <Reveal>
                <div className="eyebrow text-orange">О компании · История</div>
                <h1
                  className="mt-9 max-w-[1100px] font-mono uppercase text-white"
                  style={{ fontSize: "clamp(40px, 7vw, 112px)", lineHeight: 0.96, letterSpacing: "-0.01em" }}
                >
                  Сложные идеи.
                  <br />
                  <span className="text-orange">Управляемая</span> реализация.
                </h1>
                <p
                  className="mt-10 max-w-[720px] font-body text-white/75"
                  style={{ fontSize: "clamp(18px, 1.6vw, 24px)", lineHeight: 1.42 }}
                >
                  Как инженерное агентство для нестандартных задач выросло в систему: алгоритмический
                  подход, цифровая среда STRUKTURA+ и собственные подсистемы.
                </p>
              </Reveal>

              {/* Мини-карта истории: годы глав */}
              <Reveal className="border-t border-white/12 pt-8">
                <div className="flex items-end justify-between gap-6">
                  <ol className="flex flex-wrap gap-x-6 gap-y-3 md:gap-x-10">
                    {storyChapters.map((c) => (
                      <li key={c.id}>
                        <a
                          href={`#story-${c.id}`}
                          className="group block font-mono uppercase transition-colors"
                        >
                          <span className="block text-[clamp(20px,2vw,30px)] leading-none text-white/80 transition-colors group-hover:text-orange">
                            {c.year}
                          </span>
                          <span className="mt-2 block text-[10px] tracking-[0.16em] text-white/40">{c.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                  <a
                    href="#history"
                    className="hidden shrink-0 items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/50 transition-colors hover:text-white md:flex"
                  >
                    Листайте
                    <span className="flex h-10 w-10 items-center justify-center border border-white/20 text-orange">↓</span>
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────────── ИСТОРИЯ ПО ГОДАМ ───────────── */}
        <StoryTimeline />

        {/* ───────────── ЧТО НЕ МЕНЯЕТСЯ: миссия ───────────── */}
        <section className="py-24 md:py-36" style={{ background: "var(--orange)" }}>
          <div className="container-x">
            <Reveal>
              <SectionHead index="01" kicker="Что не меняется" theme="orange" />
              <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/70">Наша миссия</div>
              <p
                className="mt-6 max-w-[1080px] font-mono uppercase text-white"
                style={{ fontSize: "clamp(24px, 3.4vw, 54px)", lineHeight: 1.08, letterSpacing: "-0.005em" }}
              >
                {mission}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────────── Философия и принцип ───────────── */}
        <section className="bg-paper py-24 md:py-36">
          <div className="container-x grid gap-16 md:grid-cols-2 md:gap-20">
            <Reveal>
              <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-orange">Философия</div>
              <p
                className="mt-6 font-mono uppercase text-ink"
                style={{ fontSize: "clamp(22px, 2.2vw, 36px)", lineHeight: 1.12 }}
              >
                {philosophyLead}
              </p>
              <div className="mt-10">
                <More theme="light">
                  <div className="flex flex-col gap-5">
                    {philosophyParagraphs.map((p) => (
                      <p key={p.slice(0, 24)} className="font-body text-[16px] leading-[1.6] text-ink-soft">
                        {p}
                      </p>
                    ))}
                  </div>
                </More>
              </div>
            </Reveal>

            <Reveal>
              <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-orange">Наш принцип</div>
              <p
                className="mt-6 font-mono uppercase text-ink"
                style={{ fontSize: "clamp(22px, 2.2vw, 36px)", lineHeight: 1.12 }}
              >
                {principleLead}
              </p>
              <div className="mt-10">
                <More theme="light">
                  <div className="flex flex-col gap-5">
                    {principleParagraphs.map((p) => (
                      <p key={p.slice(0, 24)} className="font-body text-[16px] leading-[1.6] text-ink-soft">
                        {p}
                      </p>
                    ))}
                  </div>
                </More>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────────── Команда и культура ───────────── */}
        <section className="border-t border-black/10 bg-paper py-24 md:py-36">
          <div className="container-x">
            <Reveal>
              <SectionHead index="02" kicker="Команда" theme="light" />
              <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
                <h3
                  className="font-mono uppercase text-ink"
                  style={{ fontSize: "clamp(26px, 2.8vw, 44px)", lineHeight: 1.06 }}
                >
                  Команда, объединённая результатом
                </h3>
                <p
                  className="font-body text-ink"
                  style={{ fontSize: "clamp(18px, 1.5vw, 24px)", lineHeight: 1.4 }}
                >
                  Мы не передаём проект по цепочке — мы решаем его вместе. Каждый отвечает за свою
                  экспертизу и одновременно видит проект целиком.
                </p>
              </div>
            </Reveal>

            <TeamShowcase />

            <Reveal className="mt-12 grid border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-4">
              {teamQualities.map((q) => (
                <div key={q.title} className="flex min-h-[170px] flex-col border-b border-r border-black/10 p-7">
                  <div className="h-px w-8 bg-orange" />
                  <h4 className="mt-6 font-mono uppercase text-ink" style={{ fontSize: 17, lineHeight: 1.12 }}>
                    {q.title}
                  </h4>
                  <p className="mt-3 font-body text-ink-soft" style={{ fontSize: 15, lineHeight: 1.5 }}>
                    {q.body}
                  </p>
                </div>
              ))}
            </Reveal>

            <div className="mt-12 max-w-[900px]">
              <More theme="light" label="Культура инженерного соавторства">
                <div className="grid gap-5 sm:grid-cols-2">
                  {[...teamParagraphs, ...cultureParagraphs].map((p) => (
                    <p key={p.slice(0, 24)} className="font-body text-[16px] leading-[1.6] text-ink-soft">
                      {p}
                    </p>
                  ))}
                </div>
              </More>
            </div>
          </div>
        </section>

        <PartnersPanel partners={partners} index="03" />
        <ReviewsSlider index="04" />

        {/* ───────────── Закрытие ───────────── */}
        <section className="bg-coal-deep py-24 md:py-32">
          <div className="container-x">
            <Reveal>
              <p
                className="font-mono uppercase text-white"
                style={{ fontSize: "clamp(30px, 5vw, 80px)", lineHeight: 1.0, letterSpacing: "-0.01em" }}
              >
                Сохраняем замысел.
                <br />
                <span className="text-orange">Управляем сложностью.</span>
              </p>
            </Reveal>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
