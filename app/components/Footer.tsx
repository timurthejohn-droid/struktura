"use client";

const nav = [
  { href: "/about", label: "О компании" },
  { href: "/projects", label: "Проекты" },
  { href: "/approach", label: "Алгоритмический подход" },
  { href: "/#contact", label: "Контакты" },
  { href: "/#team", label: "Соискателям" },
];

export default function Footer() {
  return (
    <footer className="bg-coal-deep py-14 md:py-20">
      <div className="container-x">
        <div className="grid min-h-[300px] gap-12 md:grid-cols-2">
          <nav aria-label="Нижняя навигация">
            <ul className="space-y-5">
              {nav.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className="font-mono text-[12px] uppercase leading-none tracking-[0.16em] text-white transition-colors hover:text-orange"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="grid gap-12 md:grid-cols-[1fr_auto]">
            <div
              className="flex flex-col justify-end gap-6 border-t border-white/15 pt-8 md:border-l md:border-t-0 md:pl-8 md:pt-0 md:pb-8"
            >
              <a
                href="mailto:office@sk-struktura.ru"
                className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#989898] transition-colors hover:text-white"
              >
                office@sk-struktura.ru
              </a>
              <a
                href="tel:+74956642823"
                className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#989898] transition-colors hover:text-white"
              >
                8 (495) 664-28-23
              </a>
            </div>

            <a href="/" className="self-start justify-self-start md:justify-self-end" aria-label="STRUKTURA+">
              <img src="/logos/logo-white.svg" alt="STRUKTURA+" className="h-auto w-[156px]" />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/15 pt-8 md:mt-0">
          <p className="font-mono text-[12px] uppercase tracking-[0.16em] text-[#989898]">
            © 2026 Все права защищены
          </p>
        </div>
      </div>
    </footer>
  );
}
