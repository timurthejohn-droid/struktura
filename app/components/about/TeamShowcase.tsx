"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/* ─────────────────────────────────────────────────────────────
   Фото подставляются здесь. Пока реальных снимков нет:
   - GROUP_PHOTO = null → показывается оформленное место под общее фото
     (горизонтальный кадр, лучше от 2400 × 1000 px);
   - у сотрудников стоит один демо-портрет (вертикальный кадр 4:5,
     лучше от 800 × 1000 px). Имена — заглушки.
   ───────────────────────────────────────────────────────────── */
const GROUP_PHOTO: string | null = null;
const DEMO_PORTRAIT = "/team-portrait-tile.jpg";

type Member = { role: string; name: string; focus: string; photo: string };

const members: Member[] = [
  { role: "Архитектор", name: "Имя Фамилия", focus: "Сохраняет замысел на всех стадиях", photo: DEMO_PORTRAIT },
  { role: "BIM-инженер", name: "Имя Фамилия", focus: "Ведёт единую цифровую модель", photo: DEMO_PORTRAIT },
  { role: "Конструктор", name: "Имя Фамилия", focus: "Рассчитывает узлы и несущий каркас", photo: DEMO_PORTRAIT },
  { role: "Параметрист", name: "Имя Фамилия", focus: "Описывает сложную геометрию алгоритмом", photo: DEMO_PORTRAIT },
  { role: "Программист", name: "Имя Фамилия", focus: "Связывает модель с производством", photo: DEMO_PORTRAIT },
  { role: "Материалы", name: "Имя Фамилия", focus: "Подбирает и испытывает материалы", photo: DEMO_PORTRAIT },
  { role: "Технолог", name: "Имя Фамилия", focus: "Готовит изделия к изготовлению", photo: DEMO_PORTRAIT },
  { role: "Производство", name: "Имя Фамилия", focus: "Отвечает за точность каждой детали", photo: DEMO_PORTRAIT },
  { role: "Логистика", name: "Имя Фамилия", focus: "Привозит систему комплектом и в срок", photo: DEMO_PORTRAIT },
  { role: "Шеф-монтаж", name: "Имя Фамилия", focus: "Собирает объект на площадке", photo: DEMO_PORTRAIT },
];

const SPEED = 38; // px/s

export default function TeamShowcase() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const offset = useRef(0);
  const paused = useRef(false);
  const drag = useRef({ active: false, captured: false, moved: false, startX: 0, startOffset: 0 });
  const [open, setOpen] = useState<number | null>(null);

  // Пока карточка раскрыта тапом — лента стоит
  useEffect(() => {
    paused.current = open !== null;
  }, [open]);

  // Бегущая лента на rAF: мягко тормозит при наведении, тянется пальцем/мышью
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const set = setRef.current;
    if (!viewport || !track || !set) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = set.offsetWidth;
    const resize = new ResizeObserver(() => (width = set.offsetWidth));
    resize.observe(set);

    let raf = 0;
    let last = 0;
    let speed = 0;
    const tick = (time: number) => {
      const dt = last ? Math.min(0.05, (time - last) / 1000) : 0;
      last = time;
      const target = reduced || paused.current || drag.current.active ? 0 : SPEED;
      speed += (target - speed) * Math.min(1, dt * 3.5);
      if (!drag.current.active) offset.current -= speed * dt;
      if (width > 0) {
        offset.current %= width;
        if (offset.current > 0) offset.current -= width;
      }
      track.style.transform = `translate3d(${offset.current.toFixed(2)}px,0,0)`;
      raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      last = 0;
      if (entry.isIntersecting) raf = requestAnimationFrame(tick);
    });
    io.observe(viewport);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      resize.disconnect();
    };
  }, []);

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = { active: true, captured: false, moved: false, startX: event.clientX, startOffset: offset.current };
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d.active) return;
    const dx = event.clientX - d.startX;
    // Захват — только после реального сдвига, иначе клики по ссылке не дойдут
    if (!d.captured && Math.abs(dx) > 6) {
      d.captured = true;
      d.moved = true;
      viewportRef.current?.setPointerCapture(event.pointerId);
    }
    if (d.captured) offset.current = d.startOffset + dx;
  };
  const endDrag = () => {
    drag.current.active = false;
  };
  const onClickCapture = (event: React.MouseEvent) => {
    if (!drag.current.moved) return;
    drag.current.moved = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const onCardTap = (index: number) => {
    if (window.matchMedia("(hover: hover)").matches) return;
    setOpen((current) => (current === index ? null : index));
  };

  const renderSet = (copy: boolean) => (
    <div ref={copy ? undefined : setRef} className="tshow-set" aria-hidden={copy || undefined}>
      {members.map((m, i) => (
        <article
          key={i}
          className={`tshow-card${open === i ? " is-open" : ""}`}
          onClick={() => onCardTap(i)}
        >
          <div className="tshow-photo">
            <img src={`${basePath}${m.photo}`} alt={copy ? "" : `${m.role} — ${m.name}`} loading="lazy" draggable={false} />
            <span className="tshow-idx">{String(i + 1).padStart(2, "0")}</span>
            <span className="tshow-frame" aria-hidden />
            <div className="tshow-reveal">
              <span className="tshow-reveal-plus" aria-hidden>+</span>
              {m.focus}
            </div>
          </div>
          <div className="tshow-meta">
            <span className="tshow-line" aria-hidden />
            <h4 className="tshow-role">{m.role}</h4>
            <p className="tshow-name">{m.name}</p>
          </div>
        </article>
      ))}

      <Link href="/careers" className="tshow-card tshow-join" tabIndex={copy ? -1 : undefined} draggable={false}>
        <div className="tshow-photo">
          <span className="tshow-join-plus" aria-hidden>+</span>
          <span className="tshow-join-text">Здесь может быть ваше фото</span>
        </div>
        <div className="tshow-meta">
          <span className="tshow-line" aria-hidden />
          <h4 className="tshow-role">Вакансии</h4>
          <p className="tshow-name">Присоединиться к команде →</p>
        </div>
      </Link>
    </div>
  );

  return (
    <div className="tshow">
      {/* Общее фото команды */}
      <figure className="tshow-group">
        <div className="tshow-group-frame">
          {GROUP_PHOTO ? (
            <img src={`${basePath}${GROUP_PHOTO}`} alt="Команда STRUKTURA+" loading="lazy" />
          ) : (
            <div className="tshow-group-empty">
              <span className="tshow-group-icon" aria-hidden>+</span>
              <span className="tshow-group-label">Общее фото команды</span>
              <span className="tshow-group-hint">Горизонтальный кадр · от 2400 × 1000 px</span>
            </div>
          )}
          <i className="tshow-corner tl" aria-hidden />
          <i className="tshow-corner tr" aria-hidden />
          <i className="tshow-corner bl" aria-hidden />
          <i className="tshow-corner br" aria-hidden />
        </div>
        <figcaption className="tshow-caption">
          <span>Команда STRUKTURA+</span>
          <span>Архитектура · инженерия · производство · монтаж</span>
        </figcaption>
      </figure>

      {/* Бегущая строка с портретами */}
      <div className="tshow-head">
        <span>Люди за каждым решением</span>
        <span className="tshow-hint-fine">Наведите на портрет · тяните, чтобы листать</span>
        <span className="tshow-hint-touch">Нажмите на портрет · листайте</span>
      </div>

      <div
        ref={viewportRef}
        className="tshow-viewport"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") paused.current = true;
        }}
        onPointerLeave={(e) => {
          endDrag();
          if (e.pointerType === "mouse") paused.current = open !== null;
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
      >
        <div ref={trackRef} className="tshow-track">
          {renderSet(false)}
          {renderSet(true)}
        </div>
      </div>

      <style jsx global>{`
        .tshow {
          margin-top: clamp(56px, 7vw, 104px);
          --tshow-card: clamp(208px, 18vw, 272px);
          --tshow-gap: clamp(12px, 1.2vw, 18px);
        }

        /* ── Общее фото ── */
        .tshow-group-frame {
          position: relative;
          aspect-ratio: 21 / 9;
          overflow: hidden;
          background-color: #e8e5dd;
          background-image: repeating-linear-gradient(135deg, rgba(0, 0, 0, 0.045) 0 1px, transparent 1px 14px);
        }
        .tshow-group-frame img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.4s var(--ease-out);
        }
        .tshow-group:hover .tshow-group-frame img {
          transform: scale(1.025);
        }
        .tshow-group-empty {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          text-align: center;
          padding: 24px;
        }
        .tshow-group-icon {
          display: grid;
          place-items: center;
          width: 52px;
          height: 52px;
          border: 1px solid var(--orange);
          color: var(--orange);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 28px;
          line-height: 1;
          background: rgba(241, 239, 233, 0.8);
        }
        .tshow-group-label {
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(16px, 1.6vw, 22px);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .tshow-group-hint {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--ink-soft);
        }
        .tshow-corner {
          position: absolute;
          width: 22px;
          height: 22px;
          border-color: var(--orange);
          border-style: solid;
          border-width: 0;
          pointer-events: none;
          z-index: 2;
        }
        .tshow-corner.tl { top: 14px; left: 14px; border-top-width: 2px; border-left-width: 2px; }
        .tshow-corner.tr { top: 14px; right: 14px; border-top-width: 2px; border-right-width: 2px; }
        .tshow-corner.bl { bottom: 14px; left: 14px; border-bottom-width: 2px; border-left-width: 2px; }
        .tshow-corner.br { bottom: 14px; right: 14px; border-bottom-width: 2px; border-right-width: 2px; }
        .tshow-caption,
        .tshow-head {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          line-height: 1.35;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .tshow-caption {
          margin-top: 14px;
          color: var(--ink-soft);
        }

        /* ── Лента ── */
        .tshow-head {
          margin-top: clamp(56px, 6vw, 88px);
          padding-top: 22px;
          border-top: 1px solid var(--line-light);
          color: var(--orange);
        }
        .tshow-head span:not(:first-child) {
          color: var(--ink-soft);
        }
        .tshow-hint-touch {
          display: none;
        }
        .tshow-viewport {
          /* на всю ширину экрана, за пределы контейнера */
          width: 100vw;
          margin-left: calc(50% - 50vw);
          margin-top: 28px;
          overflow: hidden;
          cursor: grab;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 5%, #000 95%, transparent);
        }
        .tshow-viewport:active {
          cursor: grabbing;
        }
        .tshow-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }
        .tshow-set {
          display: flex;
          gap: var(--tshow-gap);
          padding-right: var(--tshow-gap);
        }

        /* ── Карточка ── */
        .tshow-card {
          position: relative;
          display: block;
          flex: 0 0 auto;
          width: var(--tshow-card);
          color: inherit;
          text-decoration: none;
          transition: opacity 0.45s var(--ease-out);
        }
        .tshow-track:has(.tshow-card:hover) .tshow-card:not(:hover),
        .tshow-track:has(.tshow-card.is-open) .tshow-card:not(.is-open) {
          opacity: 0.42;
        }
        .tshow-photo {
          position: relative;
          aspect-ratio: 4 / 5;
          overflow: hidden;
          background: #dedad1;
        }
        .tshow-photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          pointer-events: none;
          filter: grayscale(1) contrast(1.06) brightness(1.03);
          transform: scale(1.001);
          transition: filter 0.6s var(--ease-out), transform 1.1s var(--ease-out);
        }
        .tshow-idx {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
          padding: 3px 7px 2px;
          background: rgba(16, 16, 16, 0.62);
          color: #fff;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          transition: background-color 0.35s ease;
        }
        .tshow-frame {
          position: absolute;
          inset: 0;
          z-index: 3;
          pointer-events: none;
          box-shadow: inset 0 0 0 0 var(--orange);
          transition: box-shadow 0.45s var(--ease-out);
        }
        .tshow-reveal {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 2;
          display: flex;
          gap: 10px;
          align-items: flex-start;
          padding: 14px 16px 15px;
          background: var(--orange);
          color: #fff;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 12px;
          line-height: 1.3;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          transform: translateY(101%);
          transition: transform 0.5s var(--ease-out);
        }
        .tshow-reveal-plus {
          font-size: 15px;
          line-height: 1;
        }
        .tshow-meta {
          position: relative;
          padding-top: 14px;
        }
        .tshow-line {
          position: absolute;
          top: 0;
          left: 0;
          height: 1px;
          width: 18px;
          background: var(--orange);
          transition: width 0.6s var(--ease-out);
        }
        .tshow-role {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 14px;
          line-height: 1.15;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--ink);
        }
        .tshow-name {
          margin-top: 5px;
          font-size: 13px;
          line-height: 1.4;
          color: var(--ink-soft);
        }

        .tshow-card:hover .tshow-photo img,
        .tshow-card.is-open .tshow-photo img {
          filter: grayscale(0) contrast(1.02) brightness(1.02);
          transform: scale(1.06);
        }
        .tshow-card:hover .tshow-idx,
        .tshow-card.is-open .tshow-idx {
          background: var(--orange);
        }
        .tshow-card:hover .tshow-frame,
        .tshow-card.is-open .tshow-frame {
          box-shadow: inset 0 0 0 2px var(--orange);
        }
        .tshow-card:hover .tshow-reveal,
        .tshow-card.is-open .tshow-reveal {
          transform: translateY(0);
        }
        .tshow-card:hover .tshow-line,
        .tshow-card.is-open .tshow-line {
          width: 100%;
        }

        /* ── Карточка «Вакансии» ── */
        .tshow-join .tshow-photo {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 18px;
          background: var(--orange);
          color: #fff;
          transition: background-color 0.45s var(--ease-out);
        }
        .tshow-join-plus {
          font-family: "CoFo Sans Mono", monospace;
          font-size: clamp(96px, 9vw, 140px);
          line-height: 0.8;
          transition: transform 0.6s var(--ease-out);
          transform-origin: 0.28em 0.4em;
        }
        .tshow-join-text {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 15px;
          line-height: 1.2;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          max-width: 12ch;
        }
        .tshow-join:hover .tshow-photo {
          background: var(--ink);
        }
        .tshow-join:hover .tshow-join-plus {
          transform: rotate(90deg);
        }
        .tshow-join:hover .tshow-name {
          color: var(--orange);
        }

        @media (hover: none) {
          .tshow-hint-fine {
            display: none;
          }
          .tshow-hint-touch {
            display: inline;
          }
          .tshow-viewport {
            cursor: auto;
          }
        }
        @media (max-width: 767px) {
          .tshow-group-frame {
            aspect-ratio: 4 / 3;
          }
          .tshow-caption {
            flex-direction: column;
            gap: 6px;
          }
          .tshow-head span:not(:first-child) {
            display: none;
          }
          .tshow-corner {
            width: 16px;
            height: 16px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .tshow-photo img,
          .tshow-reveal,
          .tshow-line,
          .tshow-frame,
          .tshow-join-plus {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}
