"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

const links = [
  { href: "/about", label: "О компании" },
  { href: "/projects", label: "Проекты" },
  { href: "/digital", label: "Услуги" },
  { href: "/materials", label: "Материалы" },
  { href: "/approach", label: "Алгоритмический подход" },
  { href: "/#contact", label: "Контакты" },
  { href: "/#team", label: "Соискателям" },
];

function Wordmark() {
  return (
    <Link href="/" className="flex items-baseline select-none" aria-label="STRUKTURA">
      <span
        className="font-mono font-medium tracking-[0.04em] text-ink"
        style={{ fontSize: "20px" }}
      >
        STRUKTURA
      </span>
      <span className="font-mono text-orange" style={{ fontSize: "16px", marginLeft: "2px" }}>
        +
      </span>
    </Link>
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

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 fade-in"
      style={{
        background: scrolled ? "rgba(241,239,233,0.9)" : "rgba(241,239,233,0.82)",
        backdropFilter: scrolled ? "blur(14px)" : "blur(10px)",
        borderBottom: scrolled ? "1px solid var(--line-light)" : "1px solid rgba(0, 0, 0, 0.06)",
        transition: "background-color 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease",
      }}
    >
      <div className="container-x flex items-center justify-between" style={{ height: 72 }}>
        <Wordmark />

        <nav className="hidden lg:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="nav-link font-mono text-[11px] tracking-[0.12em] uppercase text-ink/55 hover:text-ink transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/#contact" className="hidden md:inline-flex btn btn-orange" style={{ padding: "12px 22px" }}>
            Обсудить проект
          </Link>

          <button
            className="lg:hidden flex flex-col gap-[5px] p-2"
            onClick={() => setOpen(!open)}
            aria-label="Меню"
          >
            <span
              className="block w-6 h-px bg-ink transition-transform"
              style={{ transform: open ? "rotate(45deg) translate(4px,4px)" : "none" }}
            />
            <span className="block w-6 h-px bg-ink" style={{ opacity: open ? 0 : 1 }} />
            <span
              className="block w-6 h-px bg-ink transition-transform"
              style={{ transform: open ? "rotate(-45deg) translate(4px,-4px)" : "none" }}
            />
          </button>
        </div>
      </div>

      {open && (
        <div
          className="lg:hidden border-t nav-drop"
          style={{ background: "var(--paper)", borderColor: "var(--line-light)" }}
        >
          <div className="container-x py-6 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-mono text-[13px] tracking-[0.1em] uppercase text-ink/70 hover:text-orange py-3"
              >
                {l.label}
              </Link>
            ))}
            <Link href="/#contact" onClick={() => setOpen(false)} className="btn btn-orange mt-4 justify-center">
              Обсудить проект
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
