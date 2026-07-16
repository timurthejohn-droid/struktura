import Nav from "../components/Nav";
import GridLines from "../components/GridLines";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

const ipdSteps = [
  {
    n: "01",
    text: "IPD объединяет заказчика, архитекторов, инженеров, производство и монтажную команду с самого начала проекта.",
  },
  {
    n: "02",
    text: "Цифровая платформа STRUKTURA+ становится общей моделью объекта: от идеи и инженерии до выпуска и сборки.",
  },
  {
    n: "03",
    text: "Каждое решение сразу проверяется на производство, логистику и стройку, поэтому конфликты устраняются до площадки.",
  },
  {
    n: "04",
    text: "Подход подтвержден реальными объектами: алгоритмы, допущения и инженерные решения проходят проверку в работе.",
  },
];

const stats = [
  { value: "15", label: "лет опыта в реализации сложных архитектурных объектов" },
  { value: "50+", label: "проектов по всей России — от общественных зданий до частных объектов" },
  { value: "250+", label: "первоклассных специалистов в команде архитекторов, инженеров и конструкторов" },
  { value: ">100000", label: "м2 реализованных решений — фасадов, интерьеров и конструкций" },
  { value: "98%", label: "проектов с уникальной геометрией и нестандартными решениями" },
  { value: "1", label: "единая цифровая система управления проектом от проектирования до монтажа" },
];

const partners = [
  "РМК ГРУПП",
  "Лахта Центр",
  "Сбер",
  "MR Group",
  "Газпром",
  "Vesper",
  "Atom",
  "Музей Кремля",
];

const reviews = [
  {
    name: "АТОМ",
    text: "Команда STRUKTURA быстро превратила сложную архитектурную задачу в понятный инженерный процесс. Сроки, производство и монтаж были синхронизированы без потери качества.",
  },
  {
    name: "ЛАХТА ЦЕНТР",
    text: "Особенно ценим способность команды заранее видеть производственные ограничения и предлагать решения, которые сохраняют архитектурную идею.",
  },
  {
    name: "СБЕР",
    text: "Проект велся как единая система: модель, документация, производство и монтаж не расходились между собой на критических этапах.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <section className="relative overflow-hidden bg-paper pt-28 md:pt-32">
          <GridLines theme="light" count={5} />
          <div className="container-x relative z-10 pb-16 md:pb-24">
            <div className="min-h-[420px] bg-[#cdcdcd] px-6 py-8 md:min-h-[520px] md:px-12 md:py-12">
              <div className="eyebrow text-ink">О компании</div>
              <h1
                className="mt-28 max-w-[1120px] text-ink md:mt-44"
                style={{ fontSize: "clamp(38px, 5.7vw, 76px)", lineHeight: 1, letterSpacing: "-0.03em" }}
              >
                Разработчик и&nbsp;интегратор уникальных архитектурных решений
              </h1>
            </div>
          </div>
        </section>

        <section className="bg-paper py-16 md:py-24">
          <div className="container-x">
            <div className="grid gap-12 border-t border-black/10 pt-14 md:grid-cols-2 md:gap-20">
              <div>
                <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink/35">01</p>
                <h2 className="mt-16 text-ink" style={{ fontSize: "clamp(30px, 3.1vw, 42px)", lineHeight: 1.05 }}>
                  Кто мы
                </h2>
                <div className="mt-8 max-w-[540px] space-y-4 font-body text-[15px] leading-[1.55] text-ink-soft">
                  <p>
                    STRUKTURA — разработчик и интегратор сложных архитектурных решений.
                    Наши решения охватывают всё: от фасадов и потолков до кинетических
                    конструкций.
                  </p>
                  <p>
                    Мы берем на себя роль управленческого ядра проекта — от первого
                    эскиза до финального монтажа.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-ink" style={{ fontSize: "clamp(30px, 3.1vw, 42px)", lineHeight: 1.05 }}>
                  Технологическое преимущество
                </h2>
                <p className="mt-8 max-w-[560px] font-body text-[15px] leading-[1.55] text-ink-soft">
                  Использование алгоритмического проектирования ускоряет процессы и
                  позволяет создавать конструкции сложных форм с высокой точностью.
                  Интеграция программных продуктов и собственные разработки исключают
                  ошибки на всех этапах.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#d9d9d9] py-16 md:py-20">
          <div className="container-x">
            <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-end">
              <div>
                <h2 className="max-w-[620px] text-ink" style={{ fontSize: "clamp(30px, 3.1vw, 42px)", lineHeight: 1.05 }}>
                  Алгоритмический подход STRUKTURA+
                </h2>
                <p className="mt-8 max-w-[640px] font-body text-[20px] leading-[1.4] text-ink/70">
                  В основе подхода — собственная методология цифровизации всех этапов
                  проекта. Это точная последовательность действий, которая приводит к
                  предсказуемому результату.
                </p>
              </div>
              <a href="/#algo" className="justify-self-start font-body text-[14px] uppercase text-ink transition-colors hover:text-orange md:justify-self-end">
                Подробнее →
              </a>
            </div>
          </div>
        </section>

        <section className="bg-paper py-20 md:py-28">
          <div className="container-x">
            <div className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
              <h2 className="max-w-[560px] text-ink" style={{ fontSize: "clamp(30px, 3.2vw, 44px)", lineHeight: 1.08 }}>
                STRUKTURA устраняет системные разрывы между стадиями, участниками
                и&nbsp;дисциплинами за&nbsp;счет IPD и&nbsp;полного цифрового цикла
              </h2>

              <div className="space-y-10">
                {ipdSteps.map((step) => (
                  <div key={step.n} className="grid grid-cols-[64px_1fr] gap-6 border-t border-black/10 pt-8">
                    <span className="font-body text-[30px] font-medium leading-none text-ink">{step.n}</span>
                    <p className="font-body text-[15px] leading-[1.55] text-ink-soft">{step.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#cdcdcd] py-20 md:py-28">
          <div className="container-x">
            <h2 className="ml-auto max-w-[460px] text-ink" style={{ fontSize: "clamp(30px, 3.1vw, 42px)", lineHeight: 1.05 }}>
              Цифры, за которыми стоят процессы
            </h2>
            <div className="mt-20 grid gap-x-10 gap-y-16 md:grid-cols-3">
              {stats.map((item) => (
                <div key={item.value}>
                  <div className="font-mono text-[50px] leading-none tracking-[-0.02em] text-ink">{item.value}</div>
                  <p className="mt-5 max-w-[290px] font-body text-[14px] leading-[1.45] text-ink/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper py-20 md:py-28">
          <div className="container-x">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="aspect-square bg-[#a7a7a7]" />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper py-16 md:py-20" style={{ borderTop: "1px solid var(--line-light)" }}>
          <div className="container-x">
            <div className="grid gap-12 md:grid-cols-[292px_1fr]">
              <div className="flex aspect-square items-start bg-[#a7a7a7] p-8">
                <h2 className="text-white" style={{ fontSize: "clamp(30px, 3vw, 42px)", lineHeight: 1 }}>
                  Партнеры
                </h2>
              </div>
              <div className="grid gap-x-12 gap-y-10 md:grid-cols-4">
                {partners.map((partner) => (
                  <div key={partner}>
                    <p className="font-body text-[20px] font-medium leading-none text-ink">{partner}</p>
                    <p className="mt-4 font-body text-[14px] text-ink/30">Партнер с 2020 г</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-paper py-20 md:py-28">
          <div className="container-x">
            <h2 className="text-ink" style={{ fontSize: "clamp(30px, 3.1vw, 42px)", lineHeight: 1.05 }}>
              Отзывы клиентов
            </h2>
            <div className="mt-14 flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {reviews.map((review) => (
                <article key={review.name} className="min-w-[320px] bg-[#cdcdcd] p-8 md:min-w-[520px] md:p-10">
                  <p className="font-mono text-[20px] uppercase tracking-[0.08em] text-ink">{review.name}</p>
                  <p className="mt-12 font-body text-[14px] leading-[1.45] text-ink/60">{review.text}</p>
                  <div className="mt-12 flex gap-8 font-mono text-[12px] uppercase tracking-[0.16em] text-ink">
                    <span>12.10.2025</span>
                    <span>Смотреть документ</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
