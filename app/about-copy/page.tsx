import type { Metadata } from "next";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import VersionSwitcher, { aboutVersions } from "../components/VersionSwitcher";
import AboutValues from "../components/about-story/AboutValues";
import StoryTimeline from "../components/about-story/StoryTimeline";
import { storyChapters } from "../components/about-story/storyData";
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

        <AboutValues />

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
