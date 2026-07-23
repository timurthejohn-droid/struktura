import { CAPABILITIES, MATERIALS } from "./materialsData";
import { matrixStats } from "./capabilityMatrix";
import BlueprintGrid from "../kit/BlueprintGrid";
import ScrambleText from "../kit/ScrambleText";
import NumberTicker from "../kit/NumberTicker";

// Шапка каталога вместо продающего Hero (вариант D).
// Человек уже зашёл в раздел — продавать ему раздел нечем и незачем.
// Фишки из кита работают на смысл, а не на украшение: чертёжная сетка —
// «инженерность», декодирование заголовка — терминальный характер, тикающие
// цифры — живой масштаб. Кнопок нет: каталог начинается сразу под цифрами.

export default function MaterialsCatalogHead() {
  const stats = matrixStats();

  const facts = [
    { v: MATERIALS.length, s: "", l: "материалов" },
    { v: CAPABILITIES.length, s: "", l: "возможностей" },
    { v: stats.proven, s: "", l: "пар доказано проектами" },
    { v: 6, s: "", l: "семейств" },
  ];

  return (
    <section className="relative overflow-hidden" style={{ background: "var(--coal)" }}>
      {/* чертёжная сетка — инженерная текстура фона, реагирует на курсор */}
      <div className="absolute inset-0" aria-hidden>
        <BlueprintGrid />
      </div>
      {/* слева гасим сетку, чтобы заголовок и текст читались спокойно */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(90deg, var(--coal) 0%, rgba(24,24,24,0.6) 45%, transparent 80%)" }}
        aria-hidden
      />

      <div className="container-x relative pt-32 md:pt-36 pb-10 md:pb-12">
        <span className="eyebrow text-orange rise-in">Материалы · STRUKTURA+</span>

        <div className="grid lg:grid-cols-[1fr_0.85fr] gap-5 lg:gap-16 items-end mt-5">
          <h1
            className="text-white rise-in"
            style={{
              fontSize: "clamp(46px, 9.4vw, 148px)",
              lineHeight: 0.88,
              letterSpacing: "-0.02em",
              animationDelay: "0.08s",
            }}
          >
            <ScrambleText text="Материалы" />
          </h1>

          <p
            className="font-body text-white/60 rise-in lg:pb-3"
            style={{ fontSize: "clamp(15px, 1.25vw, 19px)", lineHeight: 1.55, animationDelay: "0.16s" }}
          >
            Динамический каталог материалов и&nbsp;их&nbsp;инженерных возможностей.
          </p>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-y-6 mt-10 md:mt-12 pt-6 rise-in"
          style={{ borderTop: "1px solid var(--line-dark)", animationDelay: "0.24s" }}
        >
          {facts.map((f) => (
            <div key={f.l}>
              <NumberTicker
                value={f.v}
                suffix={f.s}
                className="font-mono text-white block"
                style={{ fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1 }}
              />
              <div
                className="font-mono text-white/45 uppercase mt-2"
                style={{ fontSize: 10.5, letterSpacing: "0.1em" }}
              >
                {f.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
