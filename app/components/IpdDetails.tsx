"use client";
import Link from "next/link";
import SectionHead from "./SectionHead";
import { useReveal } from "./useReveal";

/* Обычная модель — линейная эстафета: на каждой передаче теряются данные */
const relay = [
  "Архитектор",
  "Проектировщик",
  "Подрядчик",
  "Производство",
  "Монтаж",
];

/* Как устроен IPD в STRUKTURA — четыре опоры метода */
const pillars = [
  {
    n: "01",
    term: "Раннее вовлечение",
    body: "Проектировщики, производство и монтаж подключаются с предпроекта — когда решения ещё можно менять дёшево, а не когда они уже заложены в чужую документацию.",
  },
  {
    n: "02",
    term: "Единая цифровая модель",
    body: "Одна модель — единый источник истины для всех. Проектирование, производство и монтаж работают по ней напрямую, без переинтерпретаций и подгонки на площадке.",
  },
  {
    n: "03",
    term: "Общая ответственность",
    body: "Команда отвечает за результат целиком, а не каждый за свой участок. «Одно окно»: заказчик, генподряд, архитектура, производство и монтаж — в единой системе.",
  },
  {
    n: "04",
    term: "Решения до стройки",
    body: "Конфликты снимаются в цифровой среде на стадии моделирования. На объект выходит уже проверенное решение — без дорогих исправлений «по факту».",
  },
];

const benefits = [
  "Каждое решение сразу учитывает производство, логистику и монтаж",
  "Коллизии устраняются в модели, а не на площадке",
  "Сроки под контролем на каждом этапе",
  "Бюджет предсказуем — без удорожания «по факту»",
  "Одно окно вместо цепочки подрядчиков",
  "Архитектурная идея сохраняется без компромиссов",
];

export default function IpdDetails() {
  const relayRef = useReveal();
  const systemRef = useReveal();
  const pillarsRef = useReveal();

  return (
    <>
      {/* Эстафета против системы */}
      <section className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
        <div className="container-x">
          <SectionHead index="01" kicker="Эстафета против системы" theme="light" />

          {/* Обычная модель — линейная цепочка с разрывами */}
          <div ref={relayRef} className="reveal">
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono uppercase text-ink-soft" style={{ fontSize: 13, letterSpacing: "0.14em" }}>
                Обычная модель
              </span>
              <span className="font-mono uppercase text-orange" style={{ fontSize: 13, letterSpacing: "0.14em" }}>
                — потери на каждой передаче
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:items-stretch gap-2 md:gap-0">
              {relay.map((step, i) => (
                <div key={step} className="flex items-center md:flex-1">
                  <div
                    className="flex-1 flex items-center justify-center text-center px-4 py-6 md:py-8"
                    style={{ border: "1px solid var(--line-light)", background: "var(--paper-card)" }}
                  >
                    <span className="font-mono uppercase text-ink" style={{ fontSize: "clamp(12px, 1vw, 15px)", letterSpacing: "0.04em" }}>
                      {step}
                    </span>
                  </div>
                  {i < relay.length - 1 && (
                    <span className="font-mono text-orange px-2 md:px-3 rotate-90 md:rotate-0 self-center" aria-hidden>
                      ✕
                    </span>
                  )}
                </div>
              ))}
            </div>
            <p className="font-body text-ink-soft mt-6 max-w-2xl" style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.55 }}>
              Проект передаётся «по эстафете» из рук в руки. На каждой передаче теряются данные,
              всплывают коллизии, растёт бюджет и размывается ответственность — никто не отвечает
              за результат целиком.
            </p>
          </div>

          {/* Модель STRUKTURA — единая система вокруг модели */}
          <div ref={systemRef} className="reveal mt-16 md:mt-24">
            <div className="flex items-center justify-between mb-5">
              <span className="font-mono uppercase text-ink-soft" style={{ fontSize: 13, letterSpacing: "0.14em" }}>
                Модель STRUKTURA — IPD
              </span>
              <span className="font-mono uppercase text-orange" style={{ fontSize: 13, letterSpacing: "0.14em" }}>
                — одна система, без разрывов
              </span>
            </div>
            <div
              className="grid md:grid-cols-[1fr_auto_1fr] items-stretch"
              style={{ gap: 1, background: "var(--line-light)", border: "1px solid var(--line-light)" }}
            >
              <div className="grid grid-cols-2" style={{ gap: 1, background: "var(--line-light)" }}>
                {relay.slice(0, 4).map((step) => (
                  <div key={step} className="flex items-center justify-center text-center px-4 py-6" style={{ background: "var(--paper-card)" }}>
                    <span className="font-mono uppercase text-ink" style={{ fontSize: "clamp(12px, 1vw, 15px)", letterSpacing: "0.04em" }}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center text-center px-6 py-8 md:min-w-[220px]" style={{ background: "var(--orange)" }}>
                <span className="font-mono uppercase text-white" style={{ fontSize: "clamp(14px, 1.2vw, 18px)", letterSpacing: "0.06em", lineHeight: 1.3 }}>
                  Единая
                  <br />
                  цифровая модель
                </span>
              </div>
              <div className="flex items-center justify-center text-center px-4 py-6" style={{ background: "var(--paper-card)" }}>
                <span className="font-mono uppercase text-ink" style={{ fontSize: "clamp(12px, 1vw, 15px)", letterSpacing: "0.04em" }}>
                  {relay[4]}
                </span>
              </div>
            </div>
            <p className="font-body text-ink-soft mt-6 max-w-2xl" style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.55 }}>
              Все участники и все стадии собраны вокруг одной цифровой модели. Решения принимаются
              совместно и заранее — до выхода на площадку. Данные не теряются, потому что их некому
              терять: система одна.
            </p>
          </div>
        </div>
      </section>

      {/* Как устроен IPD в STRUKTURA — 4 опоры */}
      <section className="py-24 md:py-36" style={{ background: "var(--coal)" }}>
        <div className="container-x">
          <div ref={pillarsRef} className="reveal">
            <SectionHead index="02" kicker="Как устроен IPD в STRUKTURA" theme="dark" />
          </div>
          <div>
            {pillars.map((p) => (
              <div
                key={p.n}
                className="grid grid-cols-[auto_1fr] lg:grid-cols-[48px_minmax(0,440px)_minmax(360px,1fr)] gap-x-5 gap-y-3 lg:gap-x-12 items-start py-8 md:py-12"
                style={{ borderTop: "1px solid var(--line-dark)" }}
              >
                <span className="font-mono text-white/40 row-span-2 lg:row-span-1" style={{ fontSize: "clamp(16px, 1.6vw, 24px)" }}>
                  {p.n}
                </span>
                <h3 className="text-white" style={{ fontSize: "clamp(24px, 2.8vw, 44px)", lineHeight: 1 }}>
                  {p.term}
                </h3>
                <p
                  className="font-body text-white/60 col-start-2 lg:col-start-3 lg:pt-1 max-w-xl"
                  style={{ fontSize: "clamp(15px, 1.15vw, 18px)", lineHeight: 1.55 }}
                >
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Что даёт + вывод + CTA */}
      <section className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
        <div className="container-x">
          <SectionHead index="03" kicker="Что это даёт" theme="light" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1, background: "var(--line-light)" }}>
            {benefits.map((b, i) => (
              <div key={b} className="flex flex-col gap-6 p-6 md:p-8 min-h-[180px]" style={{ background: "var(--paper-card)" }}>
                <span className="font-mono text-orange text-xs">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-body text-ink mt-auto" style={{ fontSize: 16, lineHeight: 1.45 }}>
                  {b}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 md:mt-32 max-w-4xl mx-auto text-center">
            <p
              className="font-mono uppercase text-ink"
              style={{ fontSize: "clamp(20px, 2.6vw, 40px)", lineHeight: 1.25, letterSpacing: "0.01em" }}
            >
              IPD — это не отдельная услуга. Это то, как{" "}
              <span className="text-orange">устроена STRUKTURA</span>: сроки, бюджет и&nbsp;идея
              под контролем, потому что система одна.
            </p>
            <Link href="/#contact" className="btn btn-orange mt-12">
              Обсудить проект
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
