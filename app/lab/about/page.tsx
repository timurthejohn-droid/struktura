import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import SectionHead from "../../components/SectionHead";
import Reveal from "../../components/materials/Reveal";
import ContactForm from "../../components/ContactForm";

export const metadata: Metadata = {
  title: "О компании — Миссия и ценности · ТЕСТ — STRUKTURA+",
  description:
    "Тестовая раскладка страницы «О компании» на основе документа about.pdf: позиционирование, миссия, философия, ценности, культура, команда и ответственность.",
};

/* ─────────────────────────────────────────────────────────────
   Весь контент вынесен в константы — файл about.pdf тестовый и
   будет меняться, поэтому правки текста делаются только здесь.
   ───────────────────────────────────────────────────────────── */

const philosophyParagraphs = [
  "Инженерия должна не ограничивать архитектуру, а раскрывать её возможности. Поэтому мы не адаптируем сильную идею к привычным инструментам, а ищем точный, безопасный и реализуемый путь к её воплощению.",
  "Технология для нас не самоцель. Она ценна, когда объединяет участников, делает решения проверяемыми, снижает риски и улучшает физический результат.",
];

const values = [
  {
    n: "01",
    title: "Сохраняем замысел",
    body: "Начинаем не с технологии, а с понимания идеи. Не упрощаем сильный замысел до привычного решения.",
    practice:
      "исследуем геометрию, материалы и ограничения, сохраняя то, что определяет характер проекта.",
  },
  {
    n: "02",
    title: "Превращаем сложность в систему",
    body: "Структурируем неопределённость: делим задачу на этапы, связываем данные и заранее определяем критерии результата.",
    practice:
      "делаем процесс прозрачным и создаём точки проверки до перехода к следующей стадии.",
  },
  {
    n: "03",
    title: "Доказываем решения",
    body: "Инженерная гипотеза становится решением только после проверки.",
    practice:
      "рассчитываем, моделируем, прототипируем и испытываем до производства и работ на объекте.",
  },
  {
    n: "04",
    title: "Работаем как соавторы",
    body: "Лучший результат рождается на пересечении архитектуры, инженерии, технологий и производства.",
    practice:
      "вовлекаем специалистов заранее, делимся знаниями и спорим с решением, а не с человеком.",
  },
];

const valueFull = {
  n: "05",
  title: "Отвечаем за результат целиком",
  body: "Не ограничиваем ответственность отдельной стадией или комплектом документации. Учитываем качество, безопасность, стоимость, сроки, производство, логистику, монтаж и эксплуатацию как элементы одного результата.",
  practice:
    "своевременно говорим о рисках, выполняем договорённости и не оставляем проблему следующему участнику.",
};

const cultureParagraphs = [
  "Сложные проекты создаются не одним героем, а сильными взаимосвязями между людьми. Мы объединяем специалистов разных дисциплин вокруг общего результата.",
  "Профессиональная самостоятельность важна, но она не должна становиться профессиональной изоляцией. Каждый может задать сложный вопрос, обозначить риск или предложить альтернативу — независимо от должности. Молчание о проблеме опаснее аргументированного несогласия.",
  "Мы исследуем неопределённость, превращаем её в гипотезу, проверяем расчётами, моделями и прототипами и только после этого принимаем решение.",
  "Знания не остаются личным ресурсом одного специалиста. Мы фиксируем опыт, делимся найденными решениями и учимся на каждом проекте.",
];

const teamQualities = [
  { title: "Системное мышление", body: "видеть взаимосвязи и последствия решений." },
  { title: "Точные вопросы", body: "быстрее находить сильные решения." },
  { title: "Уважение к экспертизе", body: "строить доверие на аргументах." },
  { title: "Готовность отвечать", body: "особенно когда готового ответа ещё нет." },
];

const responsibility = [
  {
    n: "01",
    title: "За замысел",
    body: "Понимаем, зачем принято архитектурное решение, и сохраняем его смысл при инженерной разработке и реализации.",
  },
  {
    n: "02",
    title: "За решение",
    body: "Критически важные решения подтверждаем расчётом, моделью, прототипом, испытанием или производственным методом.",
  },
  {
    n: "03",
    title: "За последствия",
    body: "Оцениваем влияние решений на качество, безопасность, сроки, стоимость, производство, логистику, монтаж и эксплуатацию.",
  },
  {
    n: "04",
    title: "За коммуникацию",
    body: "Своевременно говорим о рисках и ограничениях, объясняем последствия и предлагаем аргументированные варианты действий.",
  },
];

export default function AboutLabPage() {
  return (
    <>
      <Nav />
      <main>
        {/* ───────────── [01] HERO · Позиционирование ───────────── */}
        <section className="bg-coal text-white">
          <div className="container-x">
            <div className="grid min-h-[92vh] content-end gap-14 pb-20 pt-40 md:pb-28 md:pt-48">
              <Reveal>
                <div className="eyebrow text-orange">Позиционирование · Миссия · Философия</div>
                <h1
                  className="mt-9 max-w-[1100px] font-mono uppercase text-white"
                  style={{ fontSize: "clamp(40px, 7vw, 112px)", lineHeight: 0.96, letterSpacing: "-0.01em" }}
                >
                  Сложные идеи.
                  <br />
                  <span className="text-orange">Управляемая</span> реализация.
                </h1>
              </Reveal>

              <Reveal className="grid gap-10 border-t border-white/12 pt-10 md:grid-cols-[1.1fr_0.9fr] md:gap-16">
                <p
                  className="font-body text-white/85"
                  style={{ fontSize: "clamp(18px, 1.7vw, 26px)", lineHeight: 1.42 }}
                >
                  СТРУКТУРА — разработчик и интегратор сложных архитектурных решений. Мы объединяем
                  архитектурную идею, инженерную разработку, цифровое проектирование, производство,
                  логистику и монтаж в одну управляемую систему — от первого расчёта до готового
                  объекта.
                </p>
                <p
                  className="font-body text-white/55 md:pt-1"
                  style={{ fontSize: "clamp(15px, 1.2vw, 18px)", lineHeight: 1.55 }}
                >
                  Сохраняем замысел, заранее выявляем риски и обеспечиваем предсказуемый результат
                  там, где типовых решений недостаточно.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ───────────── [02] Наша миссия (акцент) ───────────── */}
        <section className="py-24 md:py-36" style={{ background: "var(--orange)" }}>
          <div className="container-x">
            <Reveal>
              <SectionHead index="01" kicker="Наша миссия" theme="orange" />
              <p
                className="max-w-[1080px] font-mono uppercase text-white"
                style={{ fontSize: "clamp(24px, 3.4vw, 54px)", lineHeight: 1.08, letterSpacing: "-0.005em" }}
              >
                Делать сложную архитектуру реализуемой без потери авторского замысла, превращая весь
                путь от идеи до монтажа в единую управляемую систему.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────────── [03] Наша философия ───────────── */}
        <section className="bg-paper py-24 md:py-36">
          <div className="container-x">
            <Reveal>
              <SectionHead index="02" kicker="Наша философия" theme="light" />
            </Reveal>

            <Reveal className="grid gap-12 md:grid-cols-[0.95fr_1.05fr] md:gap-20">
              <p
                className="font-mono uppercase text-ink"
                style={{ fontSize: "clamp(22px, 2.4vw, 40px)", lineHeight: 1.12, letterSpacing: "-0.005em" }}
              >
                Мы верим, что сложность становится управляемой, когда люди, знания и технологии
                работают как <span className="text-orange">единая система</span>.
              </p>

              <div className="flex flex-col gap-7 md:pt-2">
                {philosophyParagraphs.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="max-w-[560px] font-body text-ink-soft"
                    style={{ fontSize: "clamp(16px, 1.25vw, 19px)", lineHeight: 1.55 }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-16 border-t border-black/10 pt-12 md:mt-24 md:pt-16">
              <p
                className="max-w-[900px] font-body text-ink"
                style={{ fontSize: "clamp(22px, 2.6vw, 38px)", lineHeight: 1.2 }}
              >
                Мы не упрощаем сложное. Мы делаем его{" "}
                <span className="font-semibold">понятным, доказуемым и реализуемым</span>.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────────── [04] Что отличает STRUKTURA + [05] Ценности ───────────── */}
        <section className="bg-coal py-24 md:py-36">
          <div className="container-x">
            <Reveal>
              <SectionHead index="03" kicker="Что отличает STRUKTURA" theme="dark" />
            </Reveal>

            <Reveal className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
              <h3
                className="font-mono uppercase text-white"
                style={{ fontSize: "clamp(26px, 2.8vw, 44px)", lineHeight: 1.06 }}
              >
                Устраняем разрывы между идеей и реализацией
              </h3>
              <div className="flex flex-col gap-6">
                <p className="font-body text-white/65" style={{ fontSize: "clamp(16px, 1.25vw, 19px)", lineHeight: 1.55 }}>
                  Проблемы сложных проектов чаще возникают между стадиями: данные теряются при
                  передаче, решения дисциплин вступают в конфликт, а производственные и монтажные
                  ограничения обнаруживаются слишком поздно.
                </p>
                <p className="font-body text-white/65" style={{ fontSize: "clamp(16px, 1.25vw, 19px)", lineHeight: 1.55 }}>
                  Мы устраняем эти разрывы. Ключевые участники подключаются на ранних стадиях,
                  работают в единой цифровой среде и рассматривают каждое решение с учётом всего
                  жизненного цикла объекта.
                </p>
              </div>
            </Reveal>

            {/* Ценности */}
            <Reveal className="mt-20 md:mt-28">
              <div className="eyebrow mb-10 text-white/55">Наши ценности</div>
              <div className="grid border-l border-t border-white/12 sm:grid-cols-2">
                {values.map((v) => (
                  <div
                    key={v.n}
                    className="group flex min-h-[280px] flex-col border-b border-r border-white/12 p-8 md:min-h-[320px] md:p-10"
                  >
                    <span className="font-mono text-[13px] tracking-[0.16em] text-orange">{v.n}</span>
                    <h4
                      className="mt-6 font-mono uppercase text-white"
                      style={{ fontSize: "clamp(19px, 1.7vw, 26px)", lineHeight: 1.1 }}
                    >
                      {v.title}
                    </h4>
                    <p className="mt-4 font-body text-white/62" style={{ fontSize: 16, lineHeight: 1.5 }}>
                      {v.body}
                    </p>
                    <p className="mt-auto pt-6 font-body text-white/45" style={{ fontSize: 14, lineHeight: 1.5 }}>
                      <span className="font-mono uppercase tracking-[0.12em] text-orange/80" style={{ fontSize: 11 }}>
                        На практике:{" "}
                      </span>
                      {v.practice}
                    </p>
                  </div>
                ))}

                {/* 05 — во всю ширину */}
                <div className="flex flex-col gap-6 border-b border-r border-white/12 p-8 md:col-span-2 md:flex-row md:items-start md:gap-16 md:p-10">
                  <div className="md:w-[42%]">
                    <span className="font-mono text-[13px] tracking-[0.16em] text-orange">{valueFull.n}</span>
                    <h4
                      className="mt-6 font-mono uppercase text-white"
                      style={{ fontSize: "clamp(19px, 1.7vw, 26px)", lineHeight: 1.1 }}
                    >
                      {valueFull.title}
                    </h4>
                  </div>
                  <div className="md:w-[58%]">
                    <p className="font-body text-white/62" style={{ fontSize: 16, lineHeight: 1.5 }}>
                      {valueFull.body}
                    </p>
                    <p className="mt-6 font-body text-white/45" style={{ fontSize: 14, lineHeight: 1.5 }}>
                      <span className="font-mono uppercase tracking-[0.12em] text-orange/80" style={{ fontSize: 11 }}>
                        На практике:{" "}
                      </span>
                      {valueFull.practice}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────────── [06] Культура и команда ───────────── */}
        <section className="bg-paper py-24 md:py-36">
          <div className="container-x">
            <Reveal>
              <SectionHead index="04" kicker="Культура и команда" theme="light" />
            </Reveal>

            {/* Культура инженерного соавторства */}
            <Reveal className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
              <h3
                className="font-mono uppercase text-ink"
                style={{ fontSize: "clamp(26px, 2.8vw, 44px)", lineHeight: 1.06 }}
              >
                Культура инженерного соавторства
              </h3>
              <div className="grid gap-6 sm:grid-cols-2">
                {cultureParagraphs.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="font-body text-ink-soft"
                    style={{ fontSize: 16, lineHeight: 1.55 }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            </Reveal>

            <Reveal className="mt-14 border-t border-black/10 pt-12 md:mt-20">
              <p
                className="max-w-[920px] font-body text-ink"
                style={{ fontSize: "clamp(20px, 2.2vw, 32px)", lineHeight: 1.22 }}
              >
                Культура СТРУКТУРЫ — это свобода профессионального мышления, соединённая с{" "}
                <span className="font-semibold">дисциплиной общей ответственности</span>.
              </p>
            </Reveal>

            {/* Команда, объединённая результатом */}
            <Reveal className="mt-20 md:mt-28">
              <h3
                className="max-w-[900px] font-mono uppercase text-ink"
                style={{ fontSize: "clamp(24px, 2.6vw, 40px)", lineHeight: 1.08 }}
              >
                Команда, объединённая результатом
              </h3>
              <div className="mt-8 grid gap-8 md:grid-cols-2 md:gap-16">
                <p className="font-body text-ink-soft" style={{ fontSize: "clamp(16px, 1.25vw, 19px)", lineHeight: 1.55 }}>
                  <span className="font-semibold text-ink">
                    Мы не передаём проект по цепочке — мы решаем его вместе.
                  </span>{" "}
                  Архитекторы, инженеры, конструкторы, параметристы, программисты, специалисты по
                  материалам, технологи, производственные и монтажные команды подключаются на ранних
                  стадиях и учитывают весь путь проекта — от идеи до готового объекта.
                </p>
                <p className="font-body text-ink-soft" style={{ fontSize: "clamp(16px, 1.25vw, 19px)", lineHeight: 1.55 }}>
                  Каждый отвечает за свою экспертизу и одновременно видит проект целиком. Поэтому
                  решения принимаются не в интересах отдельного этапа, а в интересах общего
                  результата.
                </p>
              </div>

              <div className="mt-12 grid border-l border-t border-black/10 sm:grid-cols-2 lg:grid-cols-4">
                {teamQualities.map((q) => (
                  <div key={q.title} className="flex min-h-[180px] flex-col border-b border-r border-black/10 p-7">
                    <div className="h-px w-8 bg-orange" />
                    <h4 className="mt-6 font-mono uppercase text-ink" style={{ fontSize: 17, lineHeight: 1.12 }}>
                      {q.title}
                    </h4>
                    <p className="mt-3 font-body text-ink-soft" style={{ fontSize: 15, lineHeight: 1.5 }}>
                      {q.body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ───────────── [07] Ответственность ───────────── */}
        <section className="bg-coal py-24 md:py-36">
          <div className="container-x">
            <Reveal>
              <SectionHead index="05" kicker="Ответственность" theme="dark" />
            </Reveal>

            <Reveal className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-20">
              <h3
                className="font-mono uppercase text-white"
                style={{ fontSize: "clamp(26px, 2.8vw, 44px)", lineHeight: 1.06 }}
              >
                Как мы понимаем ответственность
              </h3>
              <p className="font-body text-white/70 md:pt-2" style={{ fontSize: "clamp(18px, 1.5vw, 24px)", lineHeight: 1.4 }}>
                Мы отвечаем не только за выполненную работу, но и за последствия принятых решений.
              </p>
            </Reveal>

            <Reveal className="mt-14 grid border-l border-t border-white/12 sm:grid-cols-2 md:mt-20">
              {responsibility.map((r) => (
                <div key={r.n} className="flex min-h-[220px] flex-col border-b border-r border-white/12 p-8 md:p-10">
                  <span className="font-mono text-[13px] tracking-[0.16em] text-orange">{r.n}</span>
                  <h4
                    className="mt-6 font-mono uppercase text-white"
                    style={{ fontSize: "clamp(20px, 1.9vw, 28px)", lineHeight: 1.08 }}
                  >
                    {r.title}
                  </h4>
                  <p className="mt-4 font-body text-white/62" style={{ fontSize: 16, lineHeight: 1.5 }}>
                    {r.body}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ───────────── [08] Наш принцип + закрытие ───────────── */}
        <section className="bg-coal-deep py-24 md:py-40">
          <div className="container-x">
            <Reveal>
              <SectionHead index="06" kicker="Наш принцип" theme="dark" />
              <p
                className="max-w-[1000px] font-mono uppercase text-white"
                style={{ fontSize: "clamp(24px, 3vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.005em" }}
              >
                Технология имеет ценность только тогда, когда помогает{" "}
                <span className="text-orange">сохранить идею, снизить риск и улучшить результат</span>.
              </p>
            </Reveal>

            <Reveal className="mt-14 grid max-w-[1000px] gap-8 md:grid-cols-2 md:gap-16">
              <p className="font-body text-white/60" style={{ fontSize: "clamp(16px, 1.25vw, 19px)", lineHeight: 1.55 }}>
                Мы не внедряем цифровые инструменты ради самих инструментов. Создаём систему, в
                которой знания, данные и технологии работают на физическое воплощение проекта.
              </p>
              <p className="font-body text-white/60" style={{ fontSize: "clamp(16px, 1.25vw, 19px)", lineHeight: 1.55 }}>
                Наша ответственность заканчивается тогда, когда объект соответствует замыслу и
                работает так, как должен.
              </p>
            </Reveal>

            <Reveal className="mt-20 border-t border-white/12 pt-16 md:mt-28">
              <p
                className="font-mono uppercase text-white"
                style={{ fontSize: "clamp(30px, 5vw, 80px)", lineHeight: 1.0, letterSpacing: "-0.01em" }}
              >
                Сохраняем замысел.
                <br />
                <span className="text-orange">Управляем сложностью.</span>
              </p>
            </Reveal>
          </div>
        </section>

        {/* ───────────── [09] CTA ───────────── */}
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
