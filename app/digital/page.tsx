import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SectionHead from "../components/SectionHead";
import Reveal from "../components/materials/Reveal";
import DigitalStages from "../components/DigitalStages";
import DigitalHeroGrid from "../components/DigitalHeroGrid";

export const metadata: Metadata = {
  title: "Цифровая среда STRUKTURA+",
  description:
    "Единая цифровая среда STRUKTURA+ связывает предпроект, R&D, проектирование, производство, логистику и монтаж в одну систему.",
};

const stages = [
  {
    slug: "preproject",
    n: "01",
    title: "Предпроект",
    process:
      "Формируется архитектурная концепция, определяются технические ограничения, бюджетные рамки и сроки реализации. Закладываются базовые конструктивные решения.",
    problems: [
      "Недостаточная проработка сложных узлов",
      "Риски потери архитектурной идеи в рабочей документации",
      "Неверная оценка бюджета",
      "Отсутствие координации между подрядчиками",
      "Позднее выявление технических ограничений",
    ],
    solution: [
      "Подключение инженерной экспертизы на ранней стадии",
      "Предварительный BIM-анализ сложных зон",
      "Оценка реализуемости и бюджета до начала проектирования",
      "Формирование технической стратегии проекта",
      "Снижение рисков переработки на следующих этапах",
    ],
  },
  {
    slug: "rnd",
    n: "02",
    title: "R&D",
    process:
      "Разработка рабочей документации, интеграция подсистем в общую модель, разработка параметрических решений.",
    problems: [
      "Коллизии между разделами",
      "Недостаточность чертежей",
      "Отсутствие единой цифровой среды",
      "Ошибки передачи данных в производство",
    ],
    solution: [
      "Точная цифровая разработка подсистем",
      "Задание входных объемов материалов",
      "Взаимосвязь параметрики и расчетов",
      "Работа с производством на этапе проектирования",
    ],
  },
  {
    slug: "design",
    n: "03",
    title: "Проектирование",
    process:
      "Разработка нестандартных узлов, подсистем, креплений и решений под конкретную архитектуру.",
    problems: [
      "Отсутствие готовых решений для сложной геометрии",
      "Конфликт эстетики и инженерии",
      "Ошибки в расчетах",
      "Неопределенность конструкций",
    ],
    solution: [
      "Проектирование всех элементов в единой цифровой среде",
      "Работа в BIM-среде",
      "Координация всех разделов",
      "Выпуск детализированной рабочей документации",
      "Подготовка модели к переводу в CAM",
    ],
  },
  {
    slug: "production",
    n: "04",
    title: "Производство",
    process:
      "Производственные процессы управляются на основании модели проекта. Подбираются изготовители и контролируется каждый этап создания элементов.",
    problems: [
      "Отклонения от геометрии",
      "Несоответствие проекту",
      "Низкий контроль качества",
      "Переделки на объекте",
      "Срывы поставок и производственного графика",
    ],
    solution: [
      "Прямая связь между проектированием и производством",
      "Передача данных напрямую на станки и производственные посты",
      "Подготовка CAM-файлов и технических карт",
      "Координация поставщиков, качества и сроков",
      "Цифровой контроль производства",
    ],
  },
  {
    slug: "logistics",
    n: "05",
    title: "Логистика",
    process: "Координация поставок на объект.",
    problems: [
      "Нарушение сроков",
      "Повреждение элементов",
      "Некорректная поставка",
      "Хранение без учета особенностей материала",
    ],
    solution: [
      "Планирование поставок по графику монтажа",
      "Контроль упаковки и транспортировки",
      "Координация с генподрядчиком",
      "Маркировка и спецификация по позициям",
      "Доставка системы на объект в комплектном состоянии",
    ],
  },
  {
    slug: "assembly",
    n: "06",
    title: "Монтаж",
    process: "Финальная интеграция.",
    problems: [
      "Несогласованность графика поставок и монтажа",
      "Отклонения геометрии на объекте",
      "Ошибки позиционирования элементов",
      "Несогласованные изменения",
    ],
    solution: [
      "Шеф-монтаж и авторский контроль",
      "Проверка геометрии перед установкой",
      "Работа в едином проектном графике",
      "Быстрое внесение разъяснений на изменения",
    ],
  },
];

const benefits = [
  "Снижение количества ошибок между этапами",
  "Решения проверяются до выхода на стройку",
  "Производство и монтаж работают по одной модели",
  "Все участники работают в единой логике",
];

export default function DigitalPage() {
  return (
    <>
      <Nav />
      <main>
        {/* ───────────── HERO ───────────── */}
        <section className="relative overflow-hidden bg-coal text-white">
          <DigitalHeroGrid />
          <div className="container-x relative z-10">
            <div className="grid min-h-[92vh] content-end gap-12 pb-20 pt-40 md:pb-28 md:pt-48">
              <Reveal>
                <div className="eyebrow text-orange">STRUKTURA+ / Цифровая среда</div>
                <h1
                  className="mt-9 max-w-[1100px] font-mono uppercase text-white"
                  style={{ fontSize: "clamp(38px, 7vw, 104px)", lineHeight: 0.98, letterSpacing: "-0.01em" }}
                >
                  Единая цифровая
                  <br />
                  <span className="text-orange">среда</span> проекта
                </h1>
              </Reveal>

              <Reveal className="grid gap-10 border-t border-white/12 pt-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
                <p className="font-body text-white/85" style={{ fontSize: "clamp(17px, 1.6vw, 24px)", lineHeight: 1.45 }}>
                  Мы связали предпроект, R&D, проектирование, производство, логистику и монтаж в одну
                  систему — от первого расчёта до готового объекта.
                </p>
                <p className="font-body text-white/55 md:pt-1" style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.55 }}>
                  Одна модель, один источник данных и цифровой контроль на каждом этапе.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────────── 01 Что это дает ───────────── */}
        <section className="border-b border-black/10 bg-paper py-24 md:py-36">
          <div className="container-x">
            <Reveal>
              <SectionHead index="01" kicker="Что это дает" theme="light" />
              <p
                className="max-w-[880px] font-mono uppercase text-ink"
                style={{ fontSize: "clamp(17px, 1.9vw, 28px)", lineHeight: 1.3, letterSpacing: "-0.005em" }}
              >
                BIM-моделирование всех элементов, расчёт нагрузок и сопряжения материалов, генерация
                управляющих программ для станков — в единой системе, доступной всем участникам проекта.
              </p>
            </Reveal>

            <Reveal className="mt-16 grid border-l border-t border-black/10 sm:grid-cols-2 md:mt-24 lg:grid-cols-4">
              {benefits.map((b, i) => (
                <div
                  key={b}
                  className="relative flex min-h-[220px] flex-col justify-end gap-6 overflow-hidden border-b border-r border-black/10 bg-paper-card p-7 md:p-8"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute right-4 top-4 select-none font-mono text-ink/[0.06]"
                    style={{ fontSize: "clamp(64px, 7vw, 108px)", lineHeight: 1 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="relative h-px w-8 bg-orange" />
                  <p className="relative font-body text-ink" style={{ fontSize: 16, lineHeight: 1.45 }}>
                    {b}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ───────────── 02 Этапы подробно ───────────── */}
        <DigitalStages stages={stages} />

        {/* ───────────── 03 Итог ───────────── */}
        <section className="border-t border-white/15 py-20 md:py-28" style={{ background: "var(--coal-deep)" }}>
          <div className="container-x">
            <Reveal className="reveal-stagger">
              <div className="flex items-center justify-between border-b border-white/15 pb-5">
                <div className="flex items-center gap-5">
                  <span className="font-mono text-[12px] text-orange">03</span>
                  <h2 className="font-mono text-[13px] uppercase text-white/55 md:text-[15px]">Итог</h2>
                </div>
                <span className="h-2 w-2 rotate-45 border border-orange" aria-hidden />
              </div>

              <div className="grid gap-10 py-12 md:py-16 lg:grid-cols-[0.42fr_1fr] lg:gap-20">
                <p className="max-w-[300px] font-body text-[15px] leading-[1.6] text-white/45 md:text-[16px]">
                  Единая цифровая среда сопровождает проект от первого расчёта до монтажа.
                </p>

                <p
                  className="max-w-[860px] font-mono uppercase text-white"
                  style={{ fontSize: "clamp(25px, 2.7vw, 42px)", lineHeight: 1.16 }}
                >
                  Одна модель связывает все этапы и даёт{" "}
                  <span className="text-orange">предсказуемый результат.</span>
                </p>
              </div>
            </Reveal>

            <Reveal className="flex items-center justify-between gap-8 border-t border-white/15 pt-8">
              <Link href="/#contact" className="btn btn-orange">
                Обсудить проект
              </Link>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.14em] text-white/25 md:block">
                STRUKTURA+ DIGITAL
              </span>
            </Reveal>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
