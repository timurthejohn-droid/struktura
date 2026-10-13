"use client";
import Link from "next/link";
import { useRef } from "react";
import Stage from "./three/Stage";
import RealSubsystem from "./three/RealSubsystem";
import { createShellState } from "./three/state";
import { Reveal } from "./shared";

const areas = ["Фасады", "Интерьеры", "Потолки", "Арт-объекты", "Кинетические конструкции", "Специальные конструкции"];

export default function SubsFinal() {
  const state = useRef(createShellState({ layer: "bearing", spin: 0.6 }));
  return (
    <section className="relative overflow-hidden bg-coal-deep text-white">
      {/* Бегущая строка областей применения */}
      <div className="overflow-hidden border-b border-white/10 py-8 md:py-10">
        <div className="kit-marquee flex items-center gap-10">
          {[...areas, ...areas].map((a, i) => (
            <span key={i} className="flex items-center gap-10 whitespace-nowrap font-mono uppercase" style={{ fontSize: "clamp(32px, 5vw, 80px)", lineHeight: 1 }}>
              {a}
              <span className="text-orange">+</span>
            </span>
          ))}
        </div>
      </div>

      <div className="container-x relative grid gap-12 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <span className="eyebrow text-orange">Применение платформы</span>
          <h2 className="mt-6 text-[clamp(32px,4vw,64px)] leading-[0.98]">
            Сложная архитектура —<br />управляемый <span className="text-orange">промышленный</span> процесс
          </h2>
          <div className="mt-10 grid gap-px border border-white/12 bg-white/12 sm:grid-cols-2">
            <div className="bg-coal-deep p-5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-orange">Подсистемы</span>
              <p className="mt-2 font-body text-[15px] text-white/75">Физическая инженерная технология.</p>
            </div>
            <Link href="/digital" className="group bg-coal-deep p-5 transition-colors hover:bg-white/5">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-orange">Цифровая среда →</span>
              <p className="mt-2 font-body text-[15px] text-white/75">Общая основа данных, алгоритмов и взаимодействия участников.</p>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#contact" className="btn btn-orange">Обсудить проект</a>
            <Link href="/digital" className="btn border border-white/20 text-white">Цифровая среда STRUKTURA</Link>
          </div>
        </Reveal>
        <div className="relative h-[360px] md:h-[480px]">
          <Stage className="absolute inset-0" camera={[7.6, 5.4, 8.6]} target={[0, 3.2, 0]} parallax={1}>
            <RealSubsystem stateRef={state} />
          </Stage>
        </div>
      </div>
    </section>
  );
}
