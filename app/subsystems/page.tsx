import Nav from "../components/Nav";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

const benefits = [
  "Снижение рисков на сложных узлах",
  "Предсказуемая реализация фасадных и интерьерных решений",
  "Готовность к производству без доработок на площадке",
  "Быстрое подключение без перестройки всей системы проекта",
  "Масштабируемый процесс при индивидуальном результате",
  "Единая цифровая система управления проектом от проектирования до монтажа",
];

const specs = [
  "Любая геометрия: от плоских поверхностей до бионических структур",
  "ЧПУ-обработка и высокая точность изготовления",
  "Собственные разработки узлов и креплений",
];

export default function SubsystemsPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper">
        <section className="pt-28 md:pt-32">
          <div className="container-x">
            <div className="flex min-h-[420px] items-end bg-[#cdcdcd] px-6 py-10 md:min-h-[610px] md:px-12 md:py-14">
              <h1
                className="max-w-[960px] text-ink"
                style={{ fontSize: "clamp(38px, 5vw, 58px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
              >
                Подсистемы. Ядровое решение STRUKTURA
              </h1>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container-x grid gap-10 md:grid-cols-2 md:gap-20">
            <div className="min-h-[320px] bg-[#d1d1d1]" aria-hidden="true" />
            <div className="flex flex-col justify-between gap-12">
              <h2
                className="max-w-[590px] text-ink"
                style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.15, letterSpacing: "-0.02em" }}
              >
                Подсистема — инженерная основа сложной архитектурной формы
              </h2>
              <div className="max-w-[560px] font-body text-[16px] leading-[1.5] text-ink">
                <p>
                  Мы производим металлические подсистемы — несущий каркас любого фасада
                  или интерьера.
                </p>
                <ul className="mt-5 list-disc space-y-2 pl-5">
                  {specs.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 py-14 md:py-16">
          <div className="container-x grid gap-10 md:grid-cols-2 md:gap-20">
            <p className="font-body text-[20px] leading-[1.4] text-ink">
              STRUKTURA разрабатывает и реализует индивидуальные решения для каждого проекта,
              опираясь на проверенные принципы и опыт.
            </p>
            <p className="font-body text-[20px] leading-[1.4] text-ink">
              Мы не переносим решения из проекта в проект. Мы применяем накопленную базу знаний
              для решения новых нестандартных задач.
            </p>
          </div>
        </section>

        <section className="bg-coal py-20 md:py-28">
          <div className="container-x">
            <div className="grid gap-10 md:grid-cols-2 md:gap-20">
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-white/35">
                Выгоды для клиента
              </span>
              <h2
                className="max-w-[520px] text-white"
                style={{ fontSize: "clamp(32px, 3.4vw, 48px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
              >
                Индивидуальный результат в управляемом процессе
              </h2>
            </div>

            <div className="mt-14 grid border-l border-t border-white/12 md:grid-cols-3">
              {benefits.map((benefit, index) => (
                <div
                  key={benefit}
                  className="min-h-[180px] border-b border-r border-white/12 p-6 md:p-8"
                >
                  <span className="font-mono text-[12px] text-orange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="mt-10 max-w-[300px] font-body text-[16px] leading-[1.35] text-white/65">
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-black/10 py-16 md:py-20">
          <div className="container-x grid gap-10 md:grid-cols-2 md:gap-20">
            <h2
              className="text-ink"
              style={{ fontSize: "clamp(34px, 4.2vw, 60px)", lineHeight: 1.05, letterSpacing: "-0.03em" }}
            >
              Ключевое отличие
            </h2>
            <p className="max-w-[520px] font-mono text-[18px] uppercase leading-[1.35] text-ink">
              Каждая подсистема: кастомный инженерный продукт. Процесс ее разработки
              стандартизирован и управляем. Это позволяет сочетать индивидуальность решения
              с предсказуемостью реализации.
            </p>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
