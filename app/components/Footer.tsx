"use client";
import Link from "next/link";

const nav = [
  { href: "/#about", label: "О компании" },
  { href: "/#projects", label: "Проекты" },
  { href: "/approach", label: "Принципы работы" },
  { href: "/#contact", label: "Контакты" },
  { href: "/#team", label: "Соискателям" },
];

export default function Footer() {
  return (
    <footer className="py-16 md:py-20" style={{ background: "var(--coal-deep)" }}>
      <div className="container-x">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-12 mb-16">
          {/* Wordmark */}
          <div>
            <div className="flex items-baseline mb-5">
              <span className="font-mono font-medium tracking-[0.04em] text-white" style={{ fontSize: 24 }}>
                STRUKTURA
              </span>
              <span className="font-mono text-orange" style={{ fontSize: 18, marginLeft: 2 }}>+</span>
            </div>
            <p className="font-body text-white/40 text-sm max-w-xs leading-relaxed">
              Разработчик и&nbsp;интегратор уникальных архитектурных решений.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/30 mb-5">Навигация</p>
            <ul className="space-y-3">
              {nav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="font-mono text-[11px] tracking-[0.1em] uppercase text-white/55 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="font-mono text-[9px] tracking-[0.18em] uppercase text-white/30 mb-5">Контакты</p>
            <div className="space-y-3">
              <a href="tel:+74956642823" className="block font-body text-white/60 hover:text-white transition-colors">+7 (495) 664-28-23</a>
              <a href="mailto:office@sk-struktura.ru" className="block font-body text-white/60 hover:text-white transition-colors">office@sk-struktura.ru</a>
              <p className="font-body text-white/40 text-sm leading-relaxed pt-2">
                125040 Москва, Ленинградский проспект, д.&nbsp;15 стр.&nbsp;14, 4&nbsp;этаж
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8" style={{ borderTop: "1px solid var(--line-dark)" }}>
          <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/25">© 2025 STRUKTURA. Все права защищены.</p>
          <p className="font-mono text-[9px] tracking-[0.1em] uppercase text-white/20">Политика конфиденциальности</p>
        </div>
      </div>
    </footer>
  );
}
