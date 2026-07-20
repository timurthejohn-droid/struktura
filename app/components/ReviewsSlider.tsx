"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const reviews = [
  {
    company: "АТОМ",
    text: "Команда STRUKTURA быстро превратила сложную архитектурную задачу в понятный инженерный процесс. Сроки, производство и монтаж были синхронизированы без потери качества.",
    date: "12.10.2025",
  },
  {
    company: "ЛАХТА ЦЕНТР",
    text: "Особенно ценим способность команды заранее видеть производственные ограничения и предлагать решения, которые сохраняют архитектурную идею.",
    date: "08.09.2024",
  },
  {
    company: "СБЕР",
    text: "Проект велся как единая система: модель, документация, производство и монтаж не расходились между собой на критических этапах.",
    date: "21.06.2024",
  },
];

export default function ReviewsSlider() {
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const go = (direction: number) => setActive((current) => (current + direction + reviews.length) % reviews.length);

  return (
    <section id="reviews" className="overflow-hidden bg-paper py-24 md:py-36">
      <div className="container-x">
        <div className="flex items-end justify-between gap-8 border-b border-black/10 pb-5">
          <div>
            <span className="font-mono text-[12px] text-orange">05</span>
            <h2 className="mt-5 text-[clamp(32px,4vw,58px)] text-ink">Отзывы клиентов</h2>
          </div>
          <div className="flex gap-2">
            <button onClick={() => go(-1)} aria-label="Предыдущий отзыв" className="flex h-11 w-11 items-center justify-center border border-black/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white">←</button>
            <button onClick={() => go(1)} aria-label="Следующий отзыв" className="flex h-11 w-11 items-center justify-center border border-black/15 text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white">→</button>
          </div>
        </div>

        <div className="mt-8 overflow-hidden md:mt-10">
          <motion.div
            className="flex"
            animate={{ x: `${active * -100}%` }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 30 }}
          >
            {reviews.map((review, index) => (
              <article key={review.company} className="relative min-h-[430px] w-full shrink-0 overflow-hidden bg-white p-7 md:min-h-[500px] md:p-10 lg:p-12">
                <span className="absolute right-6 top-3 font-mono text-[clamp(110px,15vw,230px)] leading-none text-ink/[0.06] md:right-10">{String(index + 1).padStart(2, "0")}</span>
                <div className="relative flex h-full min-h-[374px] flex-col md:min-h-[420px]">
                  <p className="font-mono text-[clamp(30px,4vw,58px)] text-ink">{review.company}</p>
                  <p className="mt-16 max-w-[820px] font-body text-[clamp(19px,2vw,30px)] leading-[1.45] text-ink md:mt-20">{review.text}</p>
                  <div className="mt-auto flex flex-wrap items-center justify-between gap-5 border-t border-black/15 pt-5">
                    <span className="font-mono text-[11px] tracking-[0.16em] text-ink/55">{review.date}</span>
                    <a href="#reviews" className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink transition-colors hover:text-orange">Смотреть документ →</a>
                  </div>
                </div>
              </article>
            ))}
          </motion.div>
        </div>

        <div className="mt-7 flex items-center gap-3">
          {reviews.map((review, index) => (
            <button
              key={review.company}
              onClick={() => setActive(index)}
              aria-label={`Показать отзыв ${review.company}`}
              className="h-px transition-all"
              style={{ width: active === index ? 56 : 24, background: active === index ? "var(--orange)" : "rgba(26,26,26,.2)" }}
            />
          ))}
          <span className="ml-2 font-mono text-[11px] tracking-[0.14em] text-ink/40">{String(active + 1).padStart(2, "0")} / {String(reviews.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
