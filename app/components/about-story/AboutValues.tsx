import PartnersPanel from "../PartnersPanel";
import ReviewsSlider from "../ReviewsSlider";
import SectionHead from "../SectionHead";
import TeamShowcase from "../about/TeamShowcase";
import Reveal from "../materials/Reveal";
import More from "./More";
import {
  cultureParagraphs,
  mission,
  partners,
  philosophyLead,
  philosophyParagraphs,
  principleLead,
  principleParagraphs,
  teamParagraphs,
  teamQualities,
} from "./storyData";

// «Что не меняется» — вне хронологии: миссия, философия и принцип, команда, партнёры,
// отзывы, закрытие. Общие для V2 (/about-copy) и V3 (/about-growth) страницы «О компании».
export default function AboutValues() {
  return (
    <>
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
    </>
  );
}
