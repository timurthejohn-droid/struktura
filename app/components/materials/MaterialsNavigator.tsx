import Link from "next/link";
import SectionHead from "../SectionHead";
import Reveal from "./Reveal";
import { CAPABILITIES } from "./materialsData";

// [03] НАВИГАТОР — искать не материал, а архитектурную возможность.
// Вход в каталог: каждая возможность — раздел с двойной навигацией
// (семейство → материал → характеристики, проекты, статьи, мировые кейсы).

export default function MaterialsNavigator() {
  return (
    <section id="navigator" className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
      <div className="container-x">
        <SectionHead index="03" kicker="Искать возможность, а не сплав" theme="light" />

        <Reveal>
          <p className="font-body text-ink-soft max-w-2xl mb-12" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}>
            Сформулируйте задачу как архитектурный эффект, форму или функцию&nbsp;— внутри каждого
            раздела: подходящие материалы, их&nbsp;характеристики, наши проекты и&nbsp;мировые кейсы.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3" style={{ gap: 1, background: "var(--line-light)" }}>
            {CAPABILITIES.map((item) => (
              <Link
                key={item.slug}
                href={`/materials/${item.slug}/`}
                className="group block p-7 md:p-8 transition-colors"
                style={{ background: "var(--paper-card)" }}
              >
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-orange" style={{ fontSize: 13 }}>
                    {item.n}
                  </span>
                  <h3 className="font-mono text-ink uppercase" style={{ fontSize: "clamp(16px, 1.3vw, 19px)", letterSpacing: "0.01em" }}>
                    {item.title}
                  </h3>
                </div>
                <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--line-light)" }}>
                  <p className="font-body text-ink-soft" style={{ fontSize: 14 }}>
                    {item.tags}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <span className="font-mono text-ink/35 uppercase" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
                    {item.materials.length} материалов
                  </span>
                  <span className="font-mono text-ink/0 group-hover:text-orange transition-colors" style={{ fontSize: 12 }}>
                    Открыть →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <p className="font-mono text-ink-soft uppercase mt-8" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
            Внутри раздела: материалы → характеристики → наши проекты → статьи → мировые кейсы
          </p>
        </Reveal>
      </div>
    </section>
  );
}
