"use client";

import { useState } from "react";

const stages = [
  {
    title: "Предпроект",
    risk: "Инженерия подключается позже — ограничения всплывают уже на рабочей стадии.",
    link: "Инженерная экспертиза с первого эскиза: реализуемость проверяется до проектирования.",
  },
  {
    title: "R&D",
    risk: "Решение остаётся гипотезой: проверить его негде и некогда.",
    link: "Гипотеза проверяется расчётом, моделью и прототипом до выпуска документации.",
  },
  {
    title: "Проектирование",
    risk: "Разделы расходятся, данные пересобираются вручную при каждой передаче.",
    link: "Все разделы в одной модели — изменение расходится по проекту целиком.",
  },
  {
    title: "Производство",
    risk: "Цех получает чертёж и трактует сложную геометрию по-своему.",
    link: "Модель уходит напрямую в CAM — геометрия не создаётся заново.",
  },
  {
    title: "Логистика",
    risk: "Комплектность выясняется на площадке, а не на складе.",
    link: "Поставка спланирована по графику монтажа, позиции промаркированы.",
  },
  {
    title: "Монтаж",
    risk: "Отклонения находят там, где исправлять их дороже всего.",
    link: "Геометрия проверяется до установки, работы ведёт авторская команда.",
  },
];

/**
 * Сигнатурный блок страницы: один и тот же путь проекта в двух режимах.
 * «Обычный процесс» — цепочка рвётся на стыках, «STRUKTURA» — линия сходится
 * в непрерывную и тексты рисков сменяются связями.
 */
export default function GapSwitch() {
  const [unified, setUnified] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex border border-black/10">
          {[
            { label: "Обычный процесс", value: false },
            { label: "STRUKTURA", value: true },
          ].map((mode) => {
            const active = unified === mode.value;
            return (
              <button
                key={mode.label}
                type="button"
                onClick={() => setUnified(mode.value)}
                aria-pressed={active}
                className="px-5 py-3 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors md:px-7"
                style={{
                  background: active ? (mode.value ? "var(--orange)" : "var(--ink)") : "transparent",
                  color: active ? "#fff" : "rgba(26,26,26,0.5)",
                }}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ink/35">
          переключите режим
        </span>
      </div>

      <div className="mt-12 grid gap-0 md:mt-16 md:grid-cols-6">
        {stages.map((stage, i) => {
          const last = i === stages.length - 1;
          return (
            <div key={stage.title} className="relative pb-9 pl-6 md:pb-0 md:pl-0 md:pr-7 md:pt-9">
              {/* рельс: на мобильном вертикальный слева, на десктопе горизонтальный сверху */}
              <span
                aria-hidden
                className="absolute left-[3px] top-0 w-px md:hidden"
                style={{
                  height: last ? 0 : unified ? "100%" : "52%",
                  background: unified ? "var(--orange)" : "rgba(26,26,26,0.2)",
                  transition: "height 0.55s var(--ease-out), background-color 0.35s ease",
                }}
              />
              <span
                aria-hidden
                className="absolute left-0 top-[3px] hidden h-px md:block"
                style={{
                  width: last ? 0 : unified ? "100%" : "54%",
                  background: unified ? "var(--orange)" : "rgba(26,26,26,0.2)",
                  transition: "width 0.55s var(--ease-out), background-color 0.35s ease",
                }}
              />
              <span
                aria-hidden
                className="absolute left-0 top-0 h-[7px] w-[7px]"
                style={{
                  background: unified ? "var(--orange)" : "rgba(26,26,26,0.28)",
                  transition: "background-color 0.35s ease",
                }}
              />
              {/* метка разрыва — только в обычном режиме и только между этапами */}
              {!last && (
                <span
                  aria-hidden
                  className="absolute left-[-1px] top-[54%] font-mono text-[13px] leading-none text-orange-dark md:left-[62%] md:top-[-3px]"
                  style={{
                    opacity: unified ? 0 : 1,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  ✕
                </span>
              )}

              <h3 className="mt-4 font-mono text-[13px] uppercase tracking-[0.08em] text-ink md:mt-6">
                {stage.title}
              </h3>
              <p
                key={unified ? "u" : "b"}
                className="env-slide mt-3 max-w-[420px] font-body text-[13.5px] leading-[1.5] md:max-w-none"
                style={{ color: unified ? "rgba(26,26,26,0.72)" : "rgba(26,26,26,0.45)" }}
              >
                {unified ? stage.link : stage.risk}
              </p>
            </div>
          );
        })}
      </div>

      <p
        key={unified ? "su" : "sb"}
        className="env-slide mt-14 max-w-[900px] border-t border-black/10 pt-8 font-mono text-[clamp(17px,1.9vw,27px)] uppercase leading-[1.3] md:mt-20"
        style={{ color: unified ? "var(--ink)" : "rgba(26,26,26,0.45)" }}
      >
        {unified
          ? "Этапы связаны в один процесс: решение принимается однажды и доходит до объекта без потерь."
          : "Каждый стык между этапами — место, где теряются данные, время и деньги."}
      </p>
    </div>
  );
}
