import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import BlueprintGrid from "../../components/kit/BlueprintGrid";
import ScrambleText from "../../components/kit/ScrambleText";
import MagneticButton from "../../components/kit/MagneticButton";
import SpotlightCard from "../../components/kit/SpotlightCard";
import NumberTicker from "../../components/kit/NumberTicker";
import KitTicker from "../../components/kit/KitTicker";
import TiltCard from "../../components/kit/TiltCard";
import ExpandingIndex from "../../components/kit/ExpandingIndex";
import ScrollProgress from "../../components/kit/ScrollProgress";
import CursorGlow from "../../components/kit/CursorGlow";
import BorderBeam from "../../components/kit/BorderBeam";
import WordRotator from "../../components/kit/WordRotator";
import TextShimmer from "../../components/kit/TextShimmer";
import BeforeAfter from "../../components/kit/BeforeAfter";
import ProcessBeam from "../../components/kit/ProcessBeam";

export const metadata: Metadata = {
  title: "ЛАБ · Кит фишек в стиле STRUKTURA | STRUKTURA",
  robots: { index: false, follow: false },
};

// Витрина микровзаимодействий из «арсенала 21st.dev», пересобранных под
// брендбук STRUKTURA: острые углы, CoFo Sans Mono, #FF5A00, тёмная тема,
// чертёжная эстетика. Каждая фишка — в помеченном блоке.

function Kicker({ n, title, note }: { n: string; title: string; note: string }) {
  return (
    <div className="mb-8" style={{ borderBottom: "1px solid var(--line-dark)", paddingBottom: 14 }}>
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-orange" style={{ fontSize: 12 }}>
            {n}
          </span>
          <h2 className="font-mono uppercase text-white" style={{ fontSize: "clamp(18px, 2vw, 26px)", letterSpacing: "0.04em" }}>
            {title}
          </h2>
        </div>
        <span className="font-mono uppercase text-white/35 hidden md:block" style={{ fontSize: 10, letterSpacing: "0.12em" }}>
          {note}
        </span>
      </div>
    </div>
  );
}

const TICKER = [
  "29 материалов",
  "6 семейств",
  "77 пар доказано проектами",
  "PVD 11+ цветов",
  "панели 6×3 м",
  "1500 т металла",
  "точность ЧПУ",
  "BIM2CAM",
];

const INDEX_ROWS = [
  { n: "01", title: "Сложная форма", desc: "Геометрия задаётся проектом: многоточечная вытяжка, формовка без матрицы, моллирование и печать." },
  { n: "02", title: "Большой масштаб", desc: "Крупный формат без роста веса: соты, усиление, многослойные конструкции, инженерия кромок." },
  { n: "03", title: "Кинетика", desc: "Поверхность движется: приводы, шарниры, тросы — с расчётом циклов, шума и обслуживания заранее." },
  { n: "04", title: "Свет и отражение", desc: "Материал как инструмент света: отражение, преломление, просвечивание, дихроичные эффекты." },
];

export default function LabKit() {
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
      <Nav />

      {/* Служебная плашка */}
      <div style={{ background: "var(--coal)", paddingTop: 72 }}>
        <div className="container-x py-5">
          <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
            <span
              className="font-mono uppercase shrink-0"
              style={{ fontSize: 11, letterSpacing: "0.14em", background: "var(--orange)", color: "#fff", padding: "6px 12px" }}
            >
              Лаборатория · кит фишек
            </span>
            <p className="font-body text-white/50 max-w-3xl" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
              Микровзаимодействия из арсенала 21st.dev, пересобранные под брендбук STRUKTURA. Наводите
              курсор, скролльте — всё живое. Ничего сторонного не подключено: только framer-motion, canvas и CSS.
            </p>
          </div>
        </div>
      </div>

      <main style={{ background: "var(--coal)" }}>
        {/* ——— HERO: чертёжная сетка + декодирующийся текст + магнитная кнопка ——— */}
        <section className="relative overflow-hidden" style={{ minHeight: "72vh" }}>
          <div className="absolute inset-0">
            <BlueprintGrid />
          </div>
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(120% 90% at 50% 0%, transparent 40%, rgba(16,16,16,0.85) 100%)" }}
            aria-hidden
          />
          <div className="container-x relative flex flex-col justify-center" style={{ minHeight: "72vh", paddingTop: 60, paddingBottom: 60 }}>
            <span className="eyebrow text-orange">Кит фишек · STRUKTURA+</span>
            <h1
              className="text-white mt-6"
              style={{ fontSize: "clamp(26px, 6.6vw, 108px)", lineHeight: 0.92, letterSpacing: "-0.02em" }}
            >
              <ScrambleText text="ИНЖЕНЕРНЫЕ" />
              <br />
              <ScrambleText text="МИКРО" speed={3} />
              <span className="text-orange">
                <ScrambleText text="ВЗАИМОДЕЙСТВИЯ" speed={3} />
              </span>
            </h1>
            <p className="font-body text-white/60 mt-8 max-w-xl" style={{ fontSize: "clamp(16px, 1.4vw, 20px)", lineHeight: 1.55 }}>
              Наведите на сетку — узлы отзываются. Каждый элемент ниже можно потрогать.
            </p>
            <div className="flex flex-wrap gap-3 mt-10">
              <MagneticButton href="#cards">Смотреть кит</MagneticButton>
              <a href="#index" className="btn btn-ghost-dark">
                Компоненты
              </a>
            </div>
          </div>
        </section>

        {/* ——— ТИКЕР ——— */}
        <KitTicker items={TICKER} />

        {/* ——— СПОТЛАЙТ-БЕНТО ——— */}
        <section id="cards" className="container-x py-20 md:py-28">
          <Kicker n="01" title="Спотлайт-карточки" note="наведение · пятно света за курсором" />
          <div className="grid md:grid-cols-3 gap-4">
            <SpotlightCard className="md:col-span-2 md:row-span-2">
              <div className="p-8 md:p-10 flex flex-col justify-between" style={{ minHeight: 320 }}>
                <span className="font-mono uppercase text-white/45" style={{ fontSize: 11, letterSpacing: "0.16em" }}>
                  Ядровое решение
                </span>
                <div>
                  <h3 className="font-mono uppercase text-white" style={{ fontSize: "clamp(24px, 3vw, 40px)", lineHeight: 1.02 }}>
                    Подсистемы
                    <br />
                    <span className="text-orange">STRUKTURA</span>
                  </h3>
                  <p className="font-body text-white/55 mt-4 max-w-md" style={{ fontSize: 14.5, lineHeight: 1.55 }}>
                    Металлический несущий каркас любого фасада и интерьера. Любая геометрия, ЧПУ-точность,
                    собственные узлы R&amp;D.
                  </p>
                </div>
              </div>
            </SpotlightCard>

            {[
              { t: "Материалы", d: "Металл, стекло, камень, композиты — карта возможностей." },
              { t: "Цифровая среда", d: "Единый цифровой цикл: от модели до станка (BIM2CAM)." },
            ].map((c) => (
              <SpotlightCard key={c.t}>
                <div className="p-7" style={{ minHeight: 152 }}>
                  <h3 className="font-mono uppercase text-white" style={{ fontSize: 18, letterSpacing: "0.03em" }}>
                    {c.t}
                  </h3>
                  <p className="font-body text-white/55 mt-2.5" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    {c.d}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </section>

        {/* ——— ТИКАЮЩИЕ ЦИФРЫ ——— */}
        <section className="container-x py-20 md:py-28" style={{ borderTop: "1px solid var(--line-dark)" }}>
          <Kicker n="02" title="Тикающие цифры" note="набегают при появлении · ease-out" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10">
            {[
              { v: 500, s: "+", l: "проектов" },
              { v: 70, s: "", l: "экспертов" },
              { v: 29, s: "", l: "материалов" },
              { v: 16, s: "", l: "лет на рынке" },
            ].map((m) => (
              <div key={m.l}>
                <NumberTicker
                  value={m.v}
                  suffix={m.s}
                  className="font-mono text-white block"
                  style={{ fontSize: "clamp(40px, 6vw, 84px)", lineHeight: 0.9 }}
                />
                <div className="font-mono uppercase text-white/45 mt-3" style={{ fontSize: 11, letterSpacing: "0.1em" }}>
                  {m.l}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ——— ТИЛТ-КАРТОЧКИ ——— */}
        <section className="container-x py-20 md:py-28" style={{ borderTop: "1px solid var(--line-dark)" }}>
          <Kicker n="03" title="Тилт-карточки" note="наклон к курсору в 3D" />
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: "01", t: "Cloud Gate", m: "Anish Kapoor · Чикаго", g: "linear-gradient(135deg,#edeef0,#9a9ca0,#dadbdd)" },
              { n: "02", t: "Лахта Центр", m: "Арка входа · гипары", g: "linear-gradient(135deg,#c6e2ea,#78a0b2,#d4eaf0)" },
              { n: "03", t: "Moscow Towers", m: "15 000 пластин", g: "linear-gradient(135deg,#ff8a3d,#b23f00,#ff5a00)" },
            ].map((c) => (
              <TiltCard key={c.t}>
                <div style={{ border: "1px solid var(--line-dark)", background: "var(--coal-deep)" }}>
                  <div style={{ aspectRatio: "4/3", background: c.g }} />
                  <div className="p-5">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-mono uppercase text-white" style={{ fontSize: 15, letterSpacing: "0.03em" }}>
                        <span className="text-orange mr-3">{c.n}</span>
                        {c.t}
                      </h3>
                    </div>
                    <p className="font-mono uppercase text-white/40 mt-2" style={{ fontSize: 10, letterSpacing: "0.1em" }}>
                      {c.m}
                    </p>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* ——— РАСКРЫВАЮЩИЙСЯ ИНДЕКС ——— */}
        <section id="index" className="container-x py-20 md:py-28" style={{ borderTop: "1px solid var(--line-dark)" }}>
          <Kicker n="04" title="Раскрывающийся индекс" note="наведение · строка растёт и открывается" />
          <div className="max-w-3xl">
            <ExpandingIndex rows={INDEX_ROWS} />
          </div>
        </section>

        {/* ——— ЛУЧ ПО РАМКЕ ——— */}
        <section className="container-x py-20 md:py-28" style={{ borderTop: "1px solid var(--line-dark)" }}>
          <Kicker n="05" title="Луч по рамке" note="сегмент обходит границу" />
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { t: "R&D-узлы", d: "Собственные соединения и крепёж, рождённые в лаборатории." },
              { t: "ЧПУ-точность", d: "От 3D-модели напрямую на станок — без подгонки на площадке." },
              { t: "Контроль качества", d: "Каждая операция под протоколом и испытанием." },
            ].map((c) => (
              <BorderBeam key={c.t}>
                <div className="p-7" style={{ minHeight: 150 }}>
                  <h3 className="font-mono uppercase text-white" style={{ fontSize: 17, letterSpacing: "0.03em" }}>
                    {c.t}
                  </h3>
                  <p className="font-body text-white/55 mt-2.5" style={{ fontSize: 13.5, lineHeight: 1.5 }}>
                    {c.d}
                  </p>
                </div>
              </BorderBeam>
            ))}
          </div>
        </section>

        {/* ——— ТЕКСТОВЫЕ ЭФФЕКТЫ: сияние + ротатор слов ——— */}
        <section className="container-x py-20 md:py-28" style={{ borderTop: "1px solid var(--line-dark)" }}>
          <Kicker n="06" title="Текстовые эффекты" note="сияющая развёртка · перелистывание слова" />
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <h3 className="font-mono uppercase" style={{ fontSize: "clamp(28px, 4vw, 60px)", lineHeight: 1 }}>
              <TextShimmer text="STRUKTURA+" />
            </h3>
            <div>
              <p className="font-mono uppercase text-white" style={{ fontSize: "clamp(22px, 3vw, 40px)", lineHeight: 1.1 }}>
                Превращаем идеи в<br />
                <WordRotator
                  className="text-orange"
                  words={["ФАСАДЫ", "АРТ-ОБЪЕКТЫ", "НАВЕСЫ", "ИНТЕРЬЕРЫ", "ОБОЛОЧКИ"]}
                />
              </p>
              <p className="font-body text-white/50 mt-5 max-w-md" style={{ fontSize: 14.5, lineHeight: 1.55 }}>
                Слово меняется само — витрина спектра объектов без длинного списка.
              </p>
            </div>
          </div>
        </section>

        {/* ——— ДО / ПОСЛЕ ——— */}
        <section className="container-x py-20 md:py-28" style={{ borderTop: "1px solid var(--line-dark)" }}>
          <Kicker n="07" title="До / после" note="тащите ручку · чертёж → реализация" />
          <div className="max-w-4xl">
            <BeforeAfter afterImg="/projects/37785448.jpg" />
            <p className="font-body text-white/50 mt-5 max-w-2xl" style={{ fontSize: 14.5, lineHeight: 1.55 }}>
              Слева — чертёжная сетка модели, справа — реализованный объект. Ручкой видно,
              как цифровая модель становится построенным фасадом.
            </p>
          </div>
        </section>

        {/* ——— ПОТОК ПРОЦЕССА ——— */}
        <section className="container-x py-20 md:py-28" style={{ borderTop: "1px solid var(--line-dark)" }}>
          <Kicker n="08" title="Поток процесса" note="импульс бежит по линии этапов" />
          <div className="max-w-4xl py-4">
            <ProcessBeam />
            <p className="font-body text-white/50 mt-10 max-w-2xl" style={{ fontSize: 14.5, lineHeight: 1.55 }}>
              Данные текут между этапами без потерь — от предпроекта до монтажа в единой
              цифровой среде.
            </p>
          </div>
        </section>

        {/* ——— МАГНИТНЫЙ CTA ——— */}
        <section className="container-x py-24 md:py-32" style={{ borderTop: "1px solid var(--line-dark)" }}>
          <div className="flex flex-col items-center text-center">
            <h2 className="font-mono uppercase text-white" style={{ fontSize: "clamp(26px, 4vw, 56px)", lineHeight: 1 }}>
              <ScrambleText text="ЕСТЬ ЗАДАЧА?" />
            </h2>
            <p className="font-body text-white/55 mt-5 max-w-lg" style={{ fontSize: 16, lineHeight: 1.55 }}>
              Наведите на кнопку — она притянется. Микродеталь, из-за которой интерфейс кажется живым.
            </p>
            <div className="mt-9">
              <MagneticButton href="/#contact" strength={0.5}>
                Обсудить проект
              </MagneticButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
