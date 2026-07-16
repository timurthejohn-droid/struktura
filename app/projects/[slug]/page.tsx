import { notFound } from "next/navigation";
import Nav from "../../components/Nav";
import ContactForm from "../../components/ContactForm";
import Footer from "../../components/Footer";

const cases = {
  "01": {
    year: "2022",
    title: "Сбербанк-Сити",
    subtitle: "Межбашенное пространство штаб-квартиры Сбербанка в Москве",
    lead: "Это первая конструкция такого масштаба",
    developer: "Девелопер проекта: Sun Development",
    intro:
      "Проект архитектурного бюро Evolution Design, главная внешняя доминанта штаб-квартиры Сбера в Сбербанк-Сити.",
    description:
      "Проект полностью реализован с использованием алгоритмического проектирования, включая разработку всей конструкторской документации. В партнерстве с производственной командой мы создали уникальную систему силовой подконструкции, утепления и гидроизоляции.",
    tags: ["Металлические конструкции", "Архитектурные оболочки"],
  },
  "02": {
    year: "2022",
    title: "Лахта Центр",
    subtitle: "Арка главного входа",
    lead: "Сложная геометрия в точной монтажной последовательности",
    developer: "Девелопер проекта: Лахта Центр",
    intro:
      "Инженерная адаптация входной группы, где архитектурная выразительность требовала точной производственной логики.",
    description:
      "Команда синхронизировала проектирование, производство и монтаж, чтобы сохранить форму и обеспечить предсказуемую сборку на площадке.",
    tags: ["Входные группы", "Сложная геометрия"],
  },
  "03": {
    year: "2020",
    title: "Музей Кремля",
    subtitle: "Стеклянный пол подземного музея",
    lead: "Прозрачная конструкция с высокой инженерной ответственностью",
    developer: "Заказчик: музейный комплекс",
    intro:
      "Решение для общественного пространства, где визуальная легкость должна сочетаться с надежностью и безопасностью.",
    description:
      "Мы подготовили конструктивную схему, узлы и последовательность реализации, учитывая эксплуатационные нагрузки и точность монтажа.",
    tags: ["Стекло", "Общественные пространства"],
  },
  "04": {
    year: "2021",
    title: "Москва-Сити",
    subtitle: "Монументальные художественные панно",
    lead: "Интерьерные элементы с нестандартной геометрией",
    developer: "Заказчик: коммерческий объект",
    intro:
      "Фасадные и интерьерные решения, подготовленные к производству без потери архитектурной идеи.",
    description:
      "Проект объединил цифровое моделирование, производственную подготовку и контроль геометрии на каждом этапе.",
    tags: ["Интерьерные системы", "Панно"],
  },
};

const sections = [
  {
    title: "Мастер-план",
    text:
      "Проект полностью реализован с использованием алгоритмического проектирования. Каждый этап был связан с общей цифровой моделью: от концепта до выпуска рабочей документации и подготовки монтажа.",
  },
  {
    title: "Архитектура",
    text:
      "Наша команда участвовала в проекте на всех этапах — от концептуальной разработки до финальной реализации. Материалы и узлы адаптировались под нестандартные размеры, геометрию и требования объекта.",
  },
  {
    title: "Решения",
    text:
      "Проект демонстрирует способность решать задачи высокой сложности: интегрировать инженерные ограничения, производственную технологию и архитектурный замысел в единый контролируемый процесс.",
  },
];

function MediaPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-[#c7c7c7] ${className}`} aria-hidden="true">
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none" className="text-ink/70">
        <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="9" cy="9" r="1.4" fill="currentColor" />
        <path d="M6.5 17L11 12.5L14 15.5L16 13.5L18 15.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(cases).map((slug) => ({ slug }));
}

export default function ProjectCasePage({ params }: { params: { slug: string } }) {
  const project = cases[params.slug as keyof typeof cases];
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main className="bg-paper">
        <section className="pt-[68px]">
          <div className="relative min-h-[608px] bg-[#c7c7c7] px-6 py-11 md:px-12">
            <div className="flex items-start justify-between gap-8">
              <div className="max-w-[500px]">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#222] px-4 py-2 font-mono text-[14px] text-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-white" />
                  {project.year}
                </div>
                <p className="mt-7 font-mono text-[20px] uppercase leading-[1.2] text-ink">
                  {project.subtitle}
                </p>
              </div>
              <a href="/#contact" className="hidden items-center gap-3 font-body text-[14px] uppercase text-ink hover:text-orange md:flex">
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-black/20">→</span>
                Получить консультацию
              </a>
            </div>
            <h1
              className="absolute bottom-16 left-6 max-w-[820px] text-ink md:left-12"
              style={{ fontSize: "clamp(52px, 7vw, 98px)", lineHeight: 1.02, letterSpacing: "-0.03em" }}
            >
              {project.title}
            </h1>
          </div>
        </section>

        <section className="border-b border-black/10">
          <div className="container-x grid gap-12 py-16 md:grid-cols-2 md:py-20">
            <div>
              <h2 className="max-w-[500px] text-ink" style={{ fontSize: "clamp(30px, 3.1vw, 42px)", lineHeight: 1.05 }}>
                {project.lead}
              </h2>
              <p className="mt-24 font-body text-[14px] text-ink/70">{project.developer}</p>
            </div>
            <div className="space-y-8">
              <div className="max-w-[470px] space-y-7 font-body text-[14px] leading-[1.45] text-ink">
                <p>{project.intro}</p>
                <p>{project.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-black/20 px-5 py-2 font-mono text-[12px] uppercase text-ink">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-2">
          <MediaPlaceholder className="min-h-[360px] md:min-h-[608px]" />
          <MediaPlaceholder className="min-h-[360px] md:min-h-[608px]" />
        </section>

        <section className="border-y border-black/10">
          <div className="container-x grid gap-12 py-16 md:grid-cols-2 md:py-20">
            <h2 className="text-ink" style={{ fontSize: "clamp(30px, 3.1vw, 42px)", lineHeight: 1.05 }}>
              {sections[0].title}
            </h2>
            <p className="max-w-[480px] font-body text-[14px] leading-[1.45] text-ink">{sections[0].text}</p>
          </div>
        </section>

        <section className="grid md:grid-cols-2">
          <MediaPlaceholder className="min-h-[420px] md:min-h-[608px]" />
          <div className="flex flex-col justify-center border-l border-black/10 px-6 py-16 md:px-20">
            <h2 className="text-ink" style={{ fontSize: "clamp(30px, 3.1vw, 42px)", lineHeight: 1.05 }}>
              {sections[1].title}
            </h2>
            <p className="mt-16 max-w-[480px] font-body text-[14px] leading-[1.45] text-ink">{sections[1].text}</p>
            <div className="mt-16 h-2 w-16 bg-orange" />
          </div>
        </section>

        <section className="grid border-y border-black/10 md:grid-cols-2">
          <div className="flex flex-col justify-center px-6 py-16 md:px-12">
            <h2 className="text-ink" style={{ fontSize: "clamp(30px, 3.1vw, 42px)", lineHeight: 1.05 }}>
              {sections[2].title}
            </h2>
            <p className="mt-16 max-w-[480px] font-body text-[14px] leading-[1.45] text-ink">{sections[2].text}</p>
            <div className="mt-16 h-2 w-16 bg-orange" />
          </div>
          <MediaPlaceholder className="min-h-[420px] md:min-h-[608px]" />
        </section>

        <section className="grid border-b border-black/10 md:grid-cols-[360px_1fr]">
          <MediaPlaceholder className="min-h-[260px] md:min-h-[324px]" />
          <div className="grid grid-cols-[1fr_auto] items-center gap-10 px-6 py-14 md:px-16">
            <a href="/projects" className="font-body text-[14px] text-ink hover:text-orange">
              Еще проект
            </a>
            <span className="font-body text-[14px] text-ink">1 / 3</span>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
