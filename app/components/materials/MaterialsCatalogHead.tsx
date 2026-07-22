import { CAPABILITIES, MATERIALS } from "./materialsData";
import { matrixStats } from "./capabilityMatrix";

// Шапка каталога вместо продающего Hero (вариант D).
// Человек уже зашёл в раздел — продавать ему раздел нечем и незачем.
// Задача шапки: назвать место, дать одну строку смысла, показать масштаб
// и не отнимать первый экран у каталога. Кнопок нет намеренно: каталог
// начинается сразу под цифрами, вести к нему ссылкой было бы странно.

export default function MaterialsCatalogHead() {
  const stats = matrixStats();

  const facts = [
    { v: String(MATERIALS.length), l: "материалов" },
    { v: String(CAPABILITIES.length), l: "возможностей" },
    { v: String(stats.proven), l: "пар доказано проектами" },
    { v: "6", l: "семейств" },
  ];

  return (
    <section style={{ background: "var(--coal)" }}>
      <div className="container-x pt-32 md:pt-36 pb-10 md:pb-12">
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
            Материалы
          </h1>

          <p
            className="font-body text-white/60 rise-in lg:pb-3"
            style={{ fontSize: "clamp(15px, 1.25vw, 19px)", lineHeight: 1.55, animationDelay: "0.16s" }}
          >
            Не&nbsp;каталог поставщика, а&nbsp;карта инженерных возможностей: что материал
            умеет, где это штатная работа, а&nbsp;где доказано проектом.
          </p>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-y-6 mt-10 md:mt-12 pt-6 rise-in"
          style={{ borderTop: "1px solid var(--line-dark)", animationDelay: "0.24s" }}
        >
          {facts.map((f) => (
            <div key={f.l}>
              <div className="font-mono text-white" style={{ fontSize: "clamp(26px, 3vw, 40px)", lineHeight: 1 }}>
                {f.v}
              </div>
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
