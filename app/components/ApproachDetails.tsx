"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import SectionHead from "./SectionHead";

const principles = [
  {
    n: "01",
    term: "Дискретность",
    body: "Любой сложный проект мы разбиваем на понятные этапы: предпроект, R&D, проектирование, производство, логистика и монтаж. Это позволяет поэтапно управлять проектом и выявлять ошибки на ранних этапах.",
  },
  {
    n: "02",
    term: "Детерминированность",
    body: "Для каждого этапа заранее определено, что должно быть сделано, в какой последовательности и какой результат считается корректным. Решения принимаются не хаотично, а в рамках понятной инженерной логики.",
  },
  {
    n: "03",
    term: "Конечность",
    body: "Для каждого этапа есть срок, график, набор задач и критерий завершения. Это позволяет держать под контролем сроки, бюджет и переход к следующему этапу.",
  },
  {
    n: "04",
    term: "Массовость",
    body: "Один и тот же принцип работы применим к любым сложным объектам — независимо от материала, формы или типа конструкции. STRUKTURA прогоняет проект через одну и ту же систему принятия решений и управления реализацией.",
  },
];

const benefits = [
  "Снижение бюджета за счёт точных расчётов",
  "Сокращение сроков проектирования и реализации",
  "Исключение коллизий и переделок на стройке",
  "Оптимизация производства и логистики",
  "Контроль проекта на каждом этапе",
];

export default function ApproachDetails() {
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
      { threshold: 0.2 }
    );
    el.querySelectorAll<HTMLElement>(".algo-step").forEach((s, i) => {
      s.style.transitionDelay = `${(i % 5) * 100}ms`;
      obs.observe(s);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={wrapRef}>
      {/* Принципы */}
      <section className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
        <div className="container-x">
          <SectionHead index="02" kicker="Четыре принципа" theme="light" />
          {principles.map((p) => (
            <div
              key={p.n}
              className="algo-step grid grid-cols-[auto_1fr] lg:grid-cols-[auto_1.1fr_1.6fr_auto] gap-x-5 gap-y-3 lg:gap-x-12 items-start py-8 md:py-12"
              style={{ borderTop: "1px solid var(--line-light)" }}
            >
              <span className="font-mono text-ink/40 row-span-2 lg:row-span-1" style={{ fontSize: "clamp(16px, 1.6vw, 24px)" }}>
                {p.n}
              </span>
              <h3 className="text-ink" style={{ fontSize: "clamp(24px, 2.8vw, 44px)", lineHeight: 1 }}>
                {p.term}
              </h3>
              <p
                className="font-body text-ink-soft col-start-2 lg:col-start-3 lg:pt-1 max-w-xl"
                style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.55 }}
              >
                {p.body}
              </p>
              <span
                className="hidden lg:flex items-center justify-center rounded-full"
                style={{ width: 40, height: 40, background: "var(--ink)", color: "#fff" }}
                aria-hidden
              >
                →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Что даёт + вывод */}
      <section className="py-24 md:py-36" style={{ background: "var(--coal)" }}>
        <div className="container-x">
          <SectionHead index="03" kicker="Что даёт алгоритмический подход" theme="dark" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-5" style={{ gap: 1, background: "var(--line-dark)" }}>
            {benefits.map((b, i) => (
              <div key={b} className="algo-step flex flex-col gap-6 p-6 md:p-7 min-h-[180px]" style={{ background: "var(--coal)" }}>
                <span className="font-mono text-orange text-xs">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-body text-white/80 mt-auto" style={{ fontSize: 15, lineHeight: 1.5 }}>
                  {b}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 md:mt-32 max-w-4xl mx-auto text-center">
            <p
              className="font-mono uppercase text-white"
              style={{ fontSize: "clamp(20px, 2.6vw, 40px)", lineHeight: 1.25, letterSpacing: "0.01em" }}
            >
              Без данного подхода сложные проекты зачастую просто невозможно реализовать
              без потери <span className="text-orange">архитектурной идеи</span> или удорожания.
            </p>
            <Link href="/#contact" className="btn btn-orange mt-12">
              Обсудить проект
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
