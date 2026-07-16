"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import SectionHead from "./SectionHead";

const principles = [
  {
    n: "01",
    term: "Дискретность",
    body: "Разбиваем проект на этапы — предпроект, R&D, проектирование, производство, логистика, монтаж. Ошибки ловим рано, пока они дёшевы.",
  },
  {
    n: "02",
    term: "Детерминированность",
    body: "Для каждого этапа заранее определён результат и порядок действий. Решения принимаются по инженерной логике, а не хаотично.",
  },
  {
    n: "03",
    term: "Конечность",
    body: "У каждого этапа есть срок, график и критерий завершения. Бюджет и сроки под контролем на всём пути.",
  },
  {
    n: "04",
    term: "Массовость",
    body: "Один и тот же принцип применим к любому объекту — независимо от материала, формы и сложности.",
  },
];

const results = ["Снижение бюджета", "Сокращение сроков", "Исключение коллизий", "Контроль на каждом этапе"];

export default function AlgoPrinciples() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("algo-in");
        });
      },
      { threshold: 0.25 }
    );
    el.querySelectorAll<HTMLElement>(".algo-step").forEach((s, i) => {
      s.style.transitionDelay = `${i * 120}ms`;
      obs.observe(s);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 md:py-40 relative overflow-hidden" style={{ background: "var(--orange)" }}>
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07]"
        style={{ backgroundImage: "repeating-linear-gradient(135deg, #fff 0 1px, transparent 1px 30px)" }}
      />
      <div className="container-x relative z-10">
        <SectionHead index="04" kicker="Алгоритмический подход" theme="orange" />

        {/* story pivot: problems → solution */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-24 items-end mb-16 md:mb-24">
          <h2 className="text-white" style={{ fontSize: "clamp(30px, 4vw, 66px)", lineHeight: 1.02 }}>
            Решение — точная
            <br className="hidden md:block" /> последовательность действий
          </h2>
          <p className="font-body text-white/90" style={{ fontSize: "clamp(16px, 1.3vw, 21px)", lineHeight: 1.55 }}>
            В&nbsp;основе STRUKTURA+ — собственная методология цифровизации всех этапов
            проекта. Хаос превращается в&nbsp;систему, а&nbsp;результат становится
            предсказуемым. Подход работает по&nbsp;4&nbsp;принципам теории алгоритмов.
          </p>
        </div>

        {/* principles — sequential reveal */}
        <div ref={wrapRef}>
          {principles.map((p) => (
            <div
              key={p.n}
              className="algo-step grid grid-cols-[auto_1fr] lg:grid-cols-[auto_1.1fr_1.9fr] gap-x-5 gap-y-2 lg:gap-x-12 items-start py-8 md:py-12"
              style={{ borderTop: "1px solid rgba(255,255,255,0.32)" }}
            >
              <span className="font-mono text-white/70 row-span-2 lg:row-span-1" style={{ fontSize: "clamp(20px, 2vw, 30px)" }}>
                {p.n}
              </span>
              <h3 className="font-mono text-white" style={{ fontSize: "clamp(26px, 3vw, 48px)", lineHeight: 1 }}>
                {p.term}
              </h3>
              <p className="font-body text-white/90 col-start-2 lg:col-start-3 lg:pt-2 max-w-xl" style={{ fontSize: "clamp(15px, 1.2vw, 19px)", lineHeight: 1.55 }}>
                {p.body}
              </p>
            </div>
          ))}
        </div>

        {/* warning + results + cta */}
        <div className="mt-16 md:mt-24 pt-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-24" style={{ borderTop: "1px solid rgba(255,255,255,0.32)" }}>
          <p className="font-body text-white" style={{ fontSize: "clamp(18px, 1.8vw, 30px)", lineHeight: 1.4 }}>
            Без этого подхода сложные проекты невозможно реализовать без потери
            архитектурной идеи, качества исполнения или кратного удорожания.
          </p>
          <div>
            <div className="flex flex-wrap gap-2 mb-8">
              {results.map((r) => (
                <span
                  key={r}
                  className="font-mono text-[10px] tracking-[0.08em] uppercase px-3 py-2 text-white"
                  style={{ border: "1px solid rgba(255,255,255,0.4)" }}
                >
                  {r}
                </span>
              ))}
            </div>
            <Link href="/approach" className="btn btn-ghost-orange">Подробнее о подходе →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
