"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Version = { href: string; label: string };

export const digitalVersions: Version[] = [
  { href: "/digital", label: "V1" },
  { href: "/digital-copy", label: "V2" },
  { href: "/digital-story", label: "V3" },
];

export const subsystemsVersions: Version[] = [
  { href: "/subsystems", label: "V1" },
  { href: "/subsystems-copy", label: "V2" },
];

// Маленький плавающий переключатель между версиями одной страницы.
export default function VersionSwitcher({ versions }: { versions: Version[] }) {
  const pathname = (usePathname() || "/").replace(/\/+$/, "") || "/";

  return (
    <nav
      aria-label="Версии страницы"
      className="fixed bottom-4 left-4 z-[60] flex items-center gap-1 rounded-full border border-white/15 bg-[#151515]/85 p-1 font-mono text-[10px] uppercase tracking-[0.14em] text-white/60 shadow-lg backdrop-blur-md"
    >
      <span className="px-2 text-white/40">Версия</span>
      {versions.map((v) => {
        const active = pathname === v.href;
        return (
          <Link
            key={v.href}
            href={v.href}
            aria-current={active ? "page" : undefined}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              active ? "bg-orange text-white" : "hover:bg-white/10 hover:text-white"
            }`}
          >
            {v.label}
          </Link>
        );
      })}
    </nav>
  );
}
