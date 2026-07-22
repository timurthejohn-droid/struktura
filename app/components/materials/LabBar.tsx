import Link from "next/link";

// Служебная шапка тестовых страниц: сразу видно, какой вариант открыт
// и как перейти ко второму. На боевых страницах не используется.

export default function LabBar({
  variant,
  title,
  desc,
  other,
}: {
  variant: string;
  title: string;
  desc: string;
  other: { href: string; label: string };
}) {
  return (
    <div style={{ background: "var(--coal)", paddingTop: 72 }}>
      <div className="container-x py-5">
        <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
          <span
            className="font-mono uppercase shrink-0"
            style={{
              fontSize: 11,
              letterSpacing: "0.14em",
              background: "var(--orange)",
              color: "#fff",
              padding: "6px 12px",
            }}
          >
            Лаборатория · вариант {variant}
          </span>

          <div className="flex-1 min-w-[260px]">
            <p className="font-mono uppercase text-white" style={{ fontSize: 12.5, letterSpacing: "0.1em" }}>
              {title}
            </p>
            <p className="font-body text-white/50 mt-1.5 max-w-3xl" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
              {desc}
            </p>
          </div>

          <Link
            href={other.href}
            className="font-mono uppercase text-orange shrink-0 self-center"
            style={{ fontSize: 11, letterSpacing: "0.1em" }}
          >
            {other.label}
          </Link>
        </div>
      </div>
    </div>
  );
}
