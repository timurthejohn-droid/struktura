"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import SubsystemModel from "./SubsystemModel";

export default function SubsystemsHomeTeaser() {
  return (
    <section className="sub-home relative overflow-hidden bg-coal text-white">
      <div className="sub-home-grid" aria-hidden />

      <div className="container-x relative z-10 grid min-h-[720px] items-center gap-12 md:min-h-[864px] md:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-[650px] md:max-w-[560px] lg:max-w-[650px]">
          <motion.h2
            className="font-mono uppercase text-white"
            style={{ fontSize: "clamp(34px, 4.2vw, 66px)", lineHeight: 1, letterSpacing: 0 }}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.7, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            Подсистемы
            <br />
            <span className="text-orange">для сложной</span>
            <br />
            архитектуры.
          </motion.h2>

          <motion.p
            className="mt-9 max-w-[520px] font-body text-white/66"
            style={{ fontSize: "clamp(16px, 1.35vw, 21px)", lineHeight: 1.55 }}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.65, delay: 0.14, ease: [0.22, 1, 0.36, 1] }}
          >
            Металлический несущий каркас, узлы и крепления проектируются под геометрию,
            нагрузки, материал и способ монтажа конкретного объекта.
          </motion.p>

          <motion.div
            className="mt-10"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.6, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/subsystems" className="btn btn-orange">
              Смотреть подсистемы
            </Link>
          </motion.div>
        </div>

        <div className="sub-home-visual relative self-stretch min-h-[430px] md:min-h-[640px]" aria-label="3D модель подсистемы">
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
            screenOffsetX={-0.16}
            fullBleed
          />
        </div>
      </div>

      <div className="h-2 bg-orange" aria-hidden />

      <style jsx>{`
        .sub-home-grid {
          position: absolute;
          inset: 0;
          opacity: 0.12;
          background-image:
            linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px);
          background-size: 54px 54px;
        }
        .sub-home-visual {
          overflow: visible;
          /* Выносим колонку за правый паддинг container-x и за его auto-margin,
             чтобы модель доходила до края вьюпорта. Лишнее срежет overflow-hidden секции. */
          margin-right: calc(-24px - max(0px, (100vw - 1440px) / 2));
        }
        @media (min-width: 768px) {
          .sub-home-visual {
            margin-right: calc(-64px - max(0px, (100vw - 1440px) / 2));
          }
        }
        /* Виньетка: два линейных градиента пересекаются, давая ровное затухание
           по всем четырём краям. Один radial-gradient «съедал» бы центр модели. */
        .sub-home-visual :global(canvas) {
          -webkit-mask-image:
            linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%),
            linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%);
          mask-image:
            linear-gradient(to right, transparent 0%, #000 14%, #000 86%, transparent 100%),
            linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-composite: intersect;
        }
      `}</style>
    </section>
  );
}
