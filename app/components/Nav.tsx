"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

/* Все страницы сайта — плоским списком (помещается в высоту экрана) */
const items = [
  { href: "/about", label: "О компании" },
  { href: "/services", label: "Услуги" },
  { href: "/projects", label: "Проекты" },
  { href: "/materials", label: "Материалы" },
  { href: "/digital", label: "Цифровая среда" },
  { href: "/subsystems", label: "Подсистемы" },
  { href: "/approach", label: "Алгоритмический подход" },
  { href: "/ipd", label: "IPD" },
  { href: "/contacts", label: "Контакты" },
  { href: "/#team", label: "Соискателям" },
];

function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className="flex items-baseline select-none"
      aria-label="STRUKTURA"
    >
      <span className="font-mono font-medium tracking-[0.04em] text-ink" style={{ fontSize: 20 }}>
        STRUKTURA
      </span>
      <span className="font-mono text-orange" style={{ fontSize: 16, marginLeft: 2 }}>
        +
      </span>
    </Link>
  );
}

function ArrowRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Блокируем скролл страницы и вешаем Esc, пока панель открыта
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 fade-in"
        style={{
          background: scrolled ? "rgba(241,239,233,0.9)" : "rgba(241,239,233,0.82)",
          backdropFilter: scrolled ? "blur(14px)" : "blur(10px)",
          borderBottom: scrolled ? "1px solid var(--line-light)" : "1px solid rgba(0,0,0,0.06)",
          transition: "background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
        <div className="container-x flex items-center justify-between" style={{ height: 72 }}>
          <Wordmark />

          <div className="flex items-stretch gap-3" style={{ height: 44 }}>
            {/* Триггер меню: чёрный бокс «МЕНЮ | гамбургер», полоски анимируются на hover */}
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Открыть меню"
              aria-expanded={open}
              className="group flex items-stretch bg-ink"
              style={{ height: "100%" }}
            >
              <span className="hidden sm:flex items-center px-5 font-mono text-[12px] tracking-[0.14em] uppercase text-white">
                Меню
              </span>
              <span className="flex flex-col items-center justify-center gap-[6px] px-4 sm:border-l sm:border-white/20">
                {/* полоска 1: белая уезжает вправо, оранжевая въезжает слева */}
                <span className="relative block w-[22px] h-[2px] overflow-hidden">
                  <span className="absolute inset-0 bg-white transition-transform duration-300 ease-out group-hover:translate-x-full" />
                  <span className="absolute inset-0 -translate-x-full bg-orange transition-transform duration-300 ease-out group-hover:translate-x-0" />
                </span>
                {/* полоска 2: та же анимация со стаггером */}
                <span className="relative block w-[22px] h-[2px] overflow-hidden">
                  <span className="absolute inset-0 bg-white transition-transform duration-300 ease-out delay-75 group-hover:translate-x-full" />
                  <span className="absolute inset-0 -translate-x-full bg-orange transition-transform duration-300 ease-out delay-75 group-hover:translate-x-0" />
                </span>
              </span>
            </button>

            {/* CTA — оранжевая кнопка «Обсудить проект» (как сейчас) */}
            <Link
              href="/contacts"
              className="hidden sm:inline-flex items-center px-6 font-mono text-[12px] tracking-[0.12em] uppercase text-white bg-orange hover:bg-orange-dark transition-colors"
            >
              Обсудить проект
            </Link>
          </div>
        </div>
      </header>

      {/* ---- Оверлей с выезжающей панелью (все брейкпоинты) ---- */}
      <div
        className="fixed inset-0 z-[60]"
        style={{ pointerEvents: open ? "auto" : "none" }}
        aria-hidden={!open}
      >
        {/* Затемнение + блюр фона */}
        <div
          onClick={close}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(20,18,16,0.5)",
            backdropFilter: "blur(4px)",
            opacity: open ? 1 : 0,
            transition: "opacity 0.5s var(--ease-out)",
          }}
        />

        {/* Панель */}
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Меню сайта"
          className="no-scrollbar"
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            height: "100%",
            width: "min(560px, 100vw)",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            transform: open ? "translateX(0)" : "translateX(100%)",
            // плавный экспо-выезд как в рефе
            transition: "transform 0.62s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: "-30px 0 80px rgba(0,0,0,0.18)",
            overflowY: "auto",
          }}
        >
          {/* Шапка панели: лого + закрыть */}
          <div
            className="flex items-center justify-between px-6 md:px-10"
            style={{ height: 72, borderBottom: "1px solid var(--line-light)", flexShrink: 0 }}
          >
            <Wordmark onClick={close} />
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть меню"
              className="flex items-center justify-center w-10 h-10 -mr-2 text-ink hover:text-orange transition-colors"
            >
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
                <path d="M4 4l14 14M18 4L4 18" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
          </div>

          {/* Основные пункты — все страницы, плавный стаггер */}
          <nav className="flex-1 flex flex-col justify-center px-6 md:px-10">
            {items.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className="group flex items-center justify-between"
                style={{
                  padding: "clamp(9px, 1.5vh, 17px) 0",
                  borderBottom: "1px solid var(--line-light)",
                  opacity: open ? 1 : 0,
                  transform: open ? "translateX(0)" : "translateX(22px)",
                  transition: "opacity 0.5s var(--ease-out), transform 0.5s var(--ease-out)",
                  transitionDelay: open ? `${90 + i * 42}ms` : "0ms",
                }}
              >
                <span
                  className="font-mono font-medium uppercase text-ink transition-colors group-hover:text-orange"
                  style={{ fontSize: "clamp(16px, 2.2vh, 23px)", letterSpacing: "0.01em" }}
                >
                  {item.label}
                </span>
                <span className="text-ink/0 group-hover:text-orange transition-colors">
                  <ArrowRight />
                </span>
              </Link>
            ))}
          </nav>

          {/* Подвал панели: компактная строка */}
          <div
            className="flex items-center justify-between px-6 md:px-10"
            style={{
              borderTop: "1px solid var(--line-light)",
              flexShrink: 0,
              padding: "clamp(12px, 1.8vh, 18px) 0",
              opacity: open ? 1 : 0,
              transition: "opacity 0.5s var(--ease-out)",
              transitionDelay: open ? `${90 + items.length * 42}ms` : "0ms",
            }}
          >
            <div className="flex items-center gap-5">
              <a
                href="https://t.me/struktura"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[13px] text-ink/70 hover:text-orange transition-colors"
              >
                Telegram
              </a>
              <a
                href="tel:+74956642823"
                className="font-body text-[13px] text-ink/70 hover:text-orange transition-colors"
              >
                +7 (495) 664-28-23
              </a>
            </div>
            <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink/45">RU</span>
          </div>
        </aside>
      </div>
    </>
  );
}
