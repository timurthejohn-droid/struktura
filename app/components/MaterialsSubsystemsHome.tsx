"use client";
import Link from "next/link";
import type { ReactNode } from "react";
import SubsystemModel from "./SubsystemModel";
import { useReveal } from "./useReveal";

/**
 * «Материалы» и «Подсистемы» на главной — две горизонтальные карточки в одну линию.
 * Визуал — из прежних блоков: студийное видео материалов и 3D-модель подсистемы.
 * Старые полноэкранные блоки (MaterialsHome, SubsystemsHomeTeaser) не удалены.
 */

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";
const VIDEO_BG = "#c4c4c4"; // фон студийного видео materials_new.mp4

function CardText({
  kicker,
  title,
  body,
  cta,
}: {
  kicker: string;
  title: ReactNode;
  body: string;
  cta: string;
}) {
  return (
    <div className="relative z-10 flex h-full max-w-[340px] flex-col lg:max-w-[270px] xl:max-w-[340px]">
      <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink/55">{kicker}</span>
      <h2 className="mt-6 text-ink" style={{ fontSize: "clamp(26px, 2.5vw, 40px)", lineHeight: 1.02 }}>
        {title}
      </h2>
      <p className="mt-5 font-body text-ink-soft" style={{ fontSize: "clamp(14px, 1.05vw, 16px)", lineHeight: 1.55 }}>
        {body}
      </p>
      <span className="ms-cta btn btn-orange mt-auto self-start">{cta}</span>
    </div>
  );
}

const cardBase =
  "group relative flex overflow-hidden p-7 md:p-10 lg:min-h-0 lg:h-[clamp(460px,34vw,600px)] transition-transform duration-500 [transition-timing-function:var(--ease-out)] hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange";

export default function MaterialsSubsystemsHome() {
  const ref = useReveal(0.12);

  return (
    <section className="bg-paper py-16 md:py-24" style={{ borderTop: "1px solid var(--line-light)" }}>
      <div className="container-x">
        <div ref={ref} className="reveal grid gap-3 lg:grid-cols-2">
          {/* ——— Материалы: видео на всю карточку, текст слева поверх ——— */}
          <Link id="materials" href="/materials" className={`${cardBase} min-h-[520px]`} style={{ background: VIDEO_BG }}>
            <video
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 [transition-timing-function:var(--ease-out)] group-hover:scale-[1.04]"
              src={`${BP}/materials/materials_new.mp4`}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden
            />
            {/* скрим держит текст читаемым: на десктопе слева направо, на мобильном сверху вниз */}
            <div
              className="absolute inset-0 hidden lg:block"
              style={{
                background:
                  "linear-gradient(100deg, #c4c4c4 0%, rgba(196,196,196,0.92) 34%, rgba(196,196,196,0.4) 58%, rgba(196,196,196,0) 76%)",
              }}
              aria-hidden
            />
            <div
              className="absolute inset-0 lg:hidden"
              style={{
                background:
                  "linear-gradient(180deg, #c4c4c4 0%, rgba(196,196,196,0.9) 42%, rgba(196,196,196,0.2) 70%, rgba(196,196,196,0.6) 100%)",
              }}
              aria-hidden
            />
            <CardText
              kicker="Материалы"
              title={
                <>
                  Любая идея. Любая форма. <span className="whitespace-nowrap text-orange">Любой материал.</span>
                </>
              }
              body="Меняем форму, размеры, фактуру, цвет, плотность, покрытие и акустические свойства материала под задачу проекта."
              cta="Смотреть все возможности"
            />
          </Link>

          {/* ——— Подсистемы: 3D-модель справа, текст слева ——— */}
          <Link id="subsystems" href="/subsystems" className={`${cardBase} min-h-[640px] border border-black/10 bg-white`}>
            <div className="ms-visual absolute inset-x-0 bottom-20 h-[48%] lg:inset-x-auto lg:bottom-0 lg:right-0 lg:top-0 lg:h-auto lg:w-[46%] xl:w-[62%]" aria-label="3D модель подсистемы">
              <SubsystemModel
                assemblyProgress={1}
                zoomProgress={0}
                spinProgress={0}
                panelProgress={1}
                showTopPanels
                autoSpin
                idleSpeed={1.65}
                forcePanelsVisible
                hideRightPanels
                fullBleed
                idleZoom={false}
              />
            </div>
            <CardText
              kicker="Подсистемы"
              title={
                <>
                  Подсистемы <span className="text-orange">для сложной</span> архитектуры.
                </>
              }
              body="Металлический несущий каркас, узлы и крепления проектируются под геометрию, нагрузки, материал и способ монтажа объекта."
              cta="Смотреть подсистемы"
            />
          </Link>
        </div>
      </div>

      <style jsx>{`
        /* узкие экраны: длинная подпись кнопки должна помещаться в карточку */
        @media (max-width: 480px) {
          :global(.ms-cta) {
            min-width: 0;
            padding-left: 18px;
            letter-spacing: 0.08em;
          }
          :global(.ms-cta)::after {
            width: 48px;
            margin-left: 14px;
          }
        }
        @media (max-width: 380px) {
          :global(.ms-cta) {
            padding-left: 14px;
            letter-spacing: 0.03em;
          }
          :global(.ms-cta)::after {
            width: 44px;
            margin-left: 12px;
          }
        }
        /* Виньетка модели: ровное затухание по краям, как в прежнем блоке */
        .ms-visual :global(canvas) {
          -webkit-mask-image:
            linear-gradient(to right, transparent 0%, #000 16%, #000 90%, transparent 100%),
            linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%);
          mask-image:
            linear-gradient(to right, transparent 0%, #000 16%, #000 90%, transparent 100%),
            linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-composite: intersect;
        }
      `}</style>
    </section>
  );
}
