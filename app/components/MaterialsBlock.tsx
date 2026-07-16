"use client";
import { useState } from "react";
import { useReveal } from "./useReveal";
import SectionHead from "./SectionHead";

type Material = {
  name: string;
  note: string;
  can: string;
  limit: string;
  proof: string;
  tech: string;
  swatch: string;
  image?: string;
};

type Family = {
  name: string;
  short: string;
  summary: string;
  materials: Material[];
};

const families: Family[] = [
  {
    name: "Металлы",
    short: "Металлы",
    summary: "Отражение, патина, точная геометрия, крупные панели и премиальные покрытия.",
    materials: [
      {
        name: "Нержавеющая сталь",
        note: "зеркало, сатин, травление, PVD",
        can: "Становиться зеркальной или сатиновой архитектурной оболочкой.",
        limit: "Отражение, точная геометрия и скрытый крепеж в зонах высокой эксплуатации.",
        proof: "WinePark, Moscow Towers, макро-фрагменты металлических поверхностей.",
        tech: "1500x3000 мм · ~8 кг/м2 при 1 мм · НГ · интерьер / фасад",
        swatch: "linear-gradient(135deg,#f0f1f2 0%,#777b80 42%,#d9dcdf 68%,#9da1a5 100%)",
      },
      {
        name: "Латунь",
        note: "теплый золотистый тон, патина",
        can: "Создавать теплую премиальную поверхность для интерьеров и зон акцента.",
        limit: "Тактильность, статус и естественное старение становятся частью концепции.",
        proof: "Образцы полировки, сатина, лака и естественной патины.",
        tech: "1000x2000 мм · ~8,5 кг/м2 при 1 мм · сухие зоны",
        swatch: "linear-gradient(135deg,#f4df9e 0%,#9b6628 45%,#e9c66c 72%,#7a4b1e 100%)",
        image: "/materials/pane2.jpg",
      },
      {
        name: "Кортеновская сталь",
        note: "устойчивый ржаво-рыжий слой",
        can: "Делать фасад живым: поверхность меняется во времени и остается защищенной патиной.",
        limit: "Материал требует продуманного дренажа и защиты светлых поверхностей.",
        proof: "Узел вентфасада, примыкания, сценарий стекания и старения.",
        tech: "1500x3000 мм · 12-63 кг/м2 · НГ / КМ0 · фасад / ландшафт",
        swatch: "linear-gradient(135deg,#c06d37 0%,#5c2b18 48%,#a94e27 78%,#2f1b14 100%)",
      },
    ],
  },
  {
    name: "Стекло и отражение",
    short: "Стекло",
    summary: "Свет, прозрачность, глубина, зеркальность и работа с хрупкой кромкой.",
    materials: [
      {
        name: "Стекло",
        note: "прозрачность, свет, подвесные объемы",
        can: "Создавать легкие ограждения, световые перегородки и чистые отражающие плоскости.",
        limit: "Сильный ход проявляется в узлах крепления, кромках и безопасной многослойности.",
        proof: "Подвесные переговорные, стеклянные ограждения, узлы крепления.",
        tech: "по расчету · триплекс / закалка · интерьер / фасад / влажные зоны",
        swatch: "linear-gradient(135deg,rgba(212,238,244,.92) 0%,rgba(92,150,168,.58) 48%,rgba(243,255,255,.9) 100%)",
        image: "/materials/glass2.jpg",
      },
      {
        name: "Зеркало",
        note: "отражение, глубина, визуальное расширение",
        can: "Удваивать пространство и превращать плоскость в оптический инструмент.",
        limit: "Требует идеальной геометрии основания, защиты кромок и контроля искажений.",
        proof: "Макро стыков, зеркальные поверхности, фото до / после монтажа.",
        tech: "интерьер · проверка больших полотен · защита кромок",
        swatch: "linear-gradient(135deg,#f8fbff 0%,#9aa7b6 38%,#f2f5f8 58%,#6f7b88 100%)",
      },
    ],
  },
  {
    name: "Дерево и гибриды",
    short: "Дерево",
    summary: "Тепло натурального материала на стабильной инженерной основе.",
    materials: [
      {
        name: "Шпон на металле",
        note: "натуральное дерево на стабильной основе",
        can: "Соединять ощущение дерева с точностью металлической панели.",
        limit: "Гибридная панель там, где нужно дерево, но важна геометрическая дисциплина.",
        proof: "Макро стыка: шпон / металл / кромка / крепеж.",
        tech: "1250x3000 мм · 3-30 мм · интерьер · проверка пожарного класса",
        swatch: "linear-gradient(135deg,#b7834f 0%,#5a321d 42%,#d0a06a 64%,#7b4728 100%)",
      },
      {
        name: "Сублимация по дереву",
        note: "визуальный код дерева на металле",
        can: "Давать образ дерева в экстерьере там, где натуральное дерево рискованно.",
        limit: "Компромисс между теплым образом и стойкостью металлической системы.",
        proof: "Цветообразец, покрытие, сравнение с натуральным деревом.",
        tech: "по основе / профилю · ~2,7 кг/м2 при 1 мм · фасад / экстерьер",
        swatch: "linear-gradient(135deg,#c9965b 0%,#7a4b2d 34%,#e2b574 50%,#3f2a1e 100%)",
      },
    ],
  },
  {
    name: "Минеральные материалы",
    short: "Минеральные",
    summary: "Масса, фактура, огнестойкость и инженерия тяжелых плоскостей.",
    materials: [
      {
        name: "Натуральный камень",
        note: "уникальный рисунок и масса",
        can: "Создавать монументальную и тактильную поверхность с природным рисунком.",
        limit: "Главный предел не размер, а вес, хрупкость и качество крепления.",
        proof: "Схема анкера, раскрой слэба, расчет веса.",
        tech: "3200x1900 мм · 54-81 кг/м2 · интерьер / фасад с расчетом",
        swatch: "linear-gradient(135deg,#d8d4ca 0%,#7c786f 38%,#f0eee8 56%,#4d4a44 100%)",
      },
      {
        name: "Фиброцемент",
        note: "фасадные листы, окраска, фактуры",
        can: "Давать фасаду ровную минеральную поверхность с контролируемым весом.",
        limit: "Рациональный фасад работает только при правильной обработке кромок.",
        proof: "Вентфасадный пирог, подсистема, обработка реза.",
        tech: "1200x3000 мм · 16-24 кг/м2 · НГ / КМ0 · вентфасад",
        swatch: "linear-gradient(135deg,#c9c8c1 0%,#77776f 44%,#e4e1d8 72%,#5b5b55 100%)",
      },
    ],
  },
  {
    name: "Акустика",
    short: "Акустика",
    summary: "Поверхность работает не только глазами, но и акустикой помещения.",
    materials: [
      {
        name: "Акустическая панель",
        note: "перфорация, ткань, шпон, рейка",
        can: "Совмещать визуальную облицовку и акустическую функцию.",
        limit: "Материал прячет звукопоглощение внутри архитектурной поверхности.",
        proof: "Проекты акустических стеновых панелей, разрез пирога, расчет.",
        tech: "1200x2400 мм · 9-40 мм · KM1 · стены / потолки",
        swatch: "repeating-linear-gradient(90deg,#2b2b2b 0 5px,#151515 5px 11px,#6b563c 11px 12px)",
      },
      {
        name: "Звукопоглощение",
        note: "скрытый слой для снижения эха",
        can: "Улучшать акустику без изменения видимого образа.",
        limit: "Невидимый слой делает сложную поверхность комфортной.",
        proof: "Разрез: облицовка / зазор / поглотитель.",
        tech: "маты 20-100 мм · легкий · НГ / КМ0 · скрытый слой",
        swatch: "radial-gradient(circle at 24% 28%,#777 0 2px,transparent 3px), radial-gradient(circle at 70% 62%,#555 0 2px,transparent 3px), #222",
      },
    ],
  },
  {
    name: "Сложные материалы",
    short: "Сложные",
    summary: "Поверхности, испытания и технологии, которые требуют отдельного сценария доказательства.",
    materials: [
      {
        name: "Искусственный камень",
        note: "бесшовность, гибкость форм, реставрация",
        can: "Создавать бесшовные монолитные поверхности и сложные формы.",
        limit: "Силен в литой пластике, но требует контроля КЛТР и подвижного крепежа.",
        proof: "Протоколы испытаний: мороз, UV, удар, водопоглощение.",
        tech: "3680x760 мм · ~20 кг/м2 · интерьер / влажные зоны / фасад после расчета",
        swatch: "linear-gradient(135deg,#f1f0ea 0%,#bbb7ac 40%,#ffffff 62%,#8e8a82 100%)",
      },
      {
        name: "3D-печать панели",
        note: "любая форма, индивидуальный паттерн",
        can: "Печатать криволинейные панели и бесшовные паттерны без традиционной оснастки.",
        limit: "Самая явная демонстрация формы без каталога: геометрия задается проектом.",
        proof: "Цепочка: 3D-модель -> печать -> панель -> монтаж.",
        tech: "до 1,7x4,0 м · от 10 кг/м2 · интерьер / МАФ / фасад с защитой",
        swatch: "repeating-linear-gradient(135deg,#f05a00 0 2px,#242424 2px 12px,#111 12px 18px)",
      },
    ],
  },
];

export default function MaterialsBlock() {
  const ref = useReveal();
  const [familyIndex, setFamilyIndex] = useState(0);
  const [materialIndex, setMaterialIndex] = useState(0);
  const family = families[familyIndex];
  const material = family.materials[materialIndex] ?? family.materials[0];

  function selectFamily(index: number) {
    setFamilyIndex(index);
    setMaterialIndex(0);
  }

  return (
    <section id="materials" className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
      <div className="container-x">
        <div ref={ref} className="reveal">
          <SectionHead index="06" kicker="Материалы" theme="light" />

          <div className="mb-12">
            <h2 className="max-w-4xl text-ink" style={{ fontSize: "clamp(22px, 2.4vw, 38px)", lineHeight: 1.08 }}>
                Подбираем решения под проект, а&nbsp;не под возможности производства
            </h2>
          </div>

          <div className="relative border border-orange/55 bg-paper-card text-ink">
            <span className="absolute -bottom-5 -left-5 h-6 w-6 border-b border-l border-orange" aria-hidden />
            <span className="absolute -bottom-5 -right-5 h-6 w-6 border-b border-r border-orange" aria-hidden />

            <div className="grid lg:grid-cols-[330px_1fr]">
              <div className="border-b border-orange/40 lg:border-b-0 lg:border-r">
                <div className="border-b border-orange/40 px-5 py-5">
                  <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-orange">Каталог материалов</p>
                </div>
                <div>
                  {families.map((item, index) => {
                    const active = index === familyIndex;
                    return (
                      <div key={item.name} className="border-b border-orange/25">
                        <button
                          onClick={() => selectFamily(index)}
                          className="flex min-h-[64px] w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors"
                          style={{
                            background: active ? "rgba(255, 90, 0, 0.08)" : "transparent",
                            color: active ? "var(--orange)" : "var(--ink-soft)",
                          }}
                        >
                          <span className="font-mono text-[12px] uppercase leading-tight tracking-[0.14em]">{item.short}</span>
                          <span className="font-mono text-[18px] leading-none">{active ? "-" : "+"}</span>
                        </button>
                        {active && (
                          <div className="border-t border-orange/20">
                            {item.materials.map((entry, materialIdx) => {
                              const materialActive = materialIdx === materialIndex;
                              return (
                                <button
                                  key={entry.name}
                                  onClick={() => setMaterialIndex(materialIdx)}
                                  className="grid w-full grid-cols-[34px_1fr] border-b border-orange/15 text-left last:border-b-0"
                                  style={{ background: materialActive ? "rgba(255, 90, 0, 0.06)" : "transparent" }}
                                >
                                  <span className="flex items-center justify-center border-r border-orange/15 font-mono text-[10px] text-orange">
                                    {String(materialIdx + 1).padStart(2, "0")}
                                  </span>
                                  <span className="px-4 py-3">
                                    <span
                                      className="block font-mono text-[11px] uppercase leading-tight tracking-[0.1em]"
                                      style={{ color: materialActive ? "var(--orange)" : "var(--ink)" }}
                                    >
                                      {entry.name}
                                    </span>
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <article className="relative min-h-[620px] overflow-hidden bg-ink md:min-h-[720px]">
                {material.image ? (
                  <img
                    src={material.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0" style={{ background: material.swatch }} />
                )}
                <div className="absolute left-8 right-8 top-8 flex items-center justify-between text-white/70 md:left-12 md:right-12 md:top-12">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em]">Материал / {family.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em]">
                    {String(familyIndex + 1).padStart(2, "0")}.{String(materialIndex + 1).padStart(2, "0")}
                  </p>
                </div>

                <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8">
                  <div className="grid border border-white/80 text-white md:grid-cols-[170px_1fr]">
                    <div className="flex min-h-[150px] items-center justify-center border-b border-white/65 md:border-b-0 md:border-r">
                      <span className="font-mono text-[54px] leading-none">
                        {String(materialIndex + 1).padStart(2, "0")}<span className="align-super text-[20px]">+</span>
                      </span>
                    </div>
                    <div>
                      <div className="border-b border-white/65 px-5 py-4 md:px-8">
                        <p className="font-mono text-[12px] uppercase tracking-[0.2em]">Материал - {material.name}</p>
                      </div>
                      <div className="border-b border-white/65 px-5 py-4 md:px-8">
                        <p className="font-mono text-[12px] uppercase tracking-[0.2em]">Возможность - {material.limit}</p>
                      </div>
                      <div className="grid md:grid-cols-2">
                        <div className="border-b border-white/65 px-5 py-4 md:border-b-0 md:border-r md:px-8">
                          <p className="font-mono text-[12px] uppercase tracking-[0.2em]">Доказать - {material.proof}</p>
                        </div>
                        <div className="px-5 py-4 md:px-8">
                          <p className="font-mono text-[12px] uppercase tracking-[0.2em]">Техника - {material.tech}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* material tags */}
              <div className="mt-8 flex flex-wrap gap-2">
                {MATERIALS.map((m, i) => (
                  <span
                    key={m.name}
                    className="font-mono text-[10px] tracking-[0.06em] uppercase px-3 py-1.5 transition-colors"
                    style={{
                      border: `1px solid ${i === activeIdx ? "var(--orange)" : "var(--line-light)"}`,
                      color: i === activeIdx ? "var(--orange)" : "var(--ink-soft)",
                    }}
                  >
                    {m.name}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-8 flex flex-wrap gap-3">
                <Link href="/materials" className="btn btn-dark">
                  Смотреть возможности
                </Link>
                <Link href="/materials#navigator" className="btn btn-ghost-light">
                  Каталог материалов
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-between gap-5 border-t pt-8" style={{ borderColor: "var(--line-light)" }}>
            <p className="max-w-2xl font-body text-[15px] leading-relaxed text-ink-soft">
              Полный каталог можно раскрыть отдельной страницей: 29 материалов, фильтры по возможностям,
              ограничения и проектные доказательства.
            </p>
            <a href="/#contact" className="btn btn-orange">
              Обсудить материал
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
