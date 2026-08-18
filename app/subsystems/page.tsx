import Nav from "../components/Nav";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import Subsystems from "../components/Subsystems";

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
  "ЧПУ-обработка, высокая точность",
  "Собственные разработки узлов и креплений (R&D)",
];

export default function SubsystemsPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper">
        <Subsystems />

        <section className="py-20 md:py-28">
          <div className="container-x grid gap-12 md:grid-cols-[0.95fr_1.05fr] md:gap-20">
            <div>
              <span className="eyebrow text-orange">Производство</span>
              <p
                className="mt-8 max-w-[520px] font-body text-ink"
                style={{ fontSize: "clamp(24px, 2.6vw, 38px)", lineHeight: 1.22 }}
              >
                Мы производим металлические подсистемы&nbsp;— несущий каркас любого фасада
                или интерьера.
              </p>
            </div>

            {/* Тех-спецификация строками: mono-индекс + правило, как в остальных разделах */}
            <ul className="border-t border-black/10">
              {specs.map((item, index) => (
                <li
                  key={item}
                  className="hov-row relative flex gap-5 border-b border-black/10 py-6 pl-5 md:gap-8 md:py-7 md:pl-8"
                >
                  <span className="mt-1 font-mono text-[13px] leading-none text-orange">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="font-body text-ink"
                    style={{ fontSize: "clamp(16px, 1.3vw, 19px)", lineHeight: 1.45 }}
                  >
                    {item}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-black/10 py-14 md:py-20">
          <div className="container-x grid gap-10 md:grid-cols-2 md:gap-20">
            <p
              className="max-w-[520px] font-body text-ink"
              style={{ fontSize: "clamp(18px, 1.6vw, 22px)", lineHeight: 1.45 }}
            >
              <strong className="font-semibold">STRUKTURA</strong> разрабатывает и реализует
              индивидуальные решения для каждого проекта, опираясь на проверенные принципы и опыт.
            </p>
            <p
              className="max-w-[520px] font-body text-ink"
              style={{ fontSize: "clamp(18px, 1.6vw, 22px)", lineHeight: 1.45 }}
            >
              Мы не переносим решения из проекта в проект. Мы применяем накопленную{" "}
              <strong className="font-semibold">базу знаний</strong> для решения новых
              нестандартных задач.
            </p>
          </div>
        </section>

        <section className="relative overflow-hidden bg-coal py-20 md:py-28">
          {/* Техническая сетка-подложка, затухающая к низу */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
              backgroundSize: "54px 54px",
              maskImage: "radial-gradient(120% 85% at 50% 0%, #000 0%, transparent 78%)",
              WebkitMaskImage: "radial-gradient(120% 85% at 50% 0%, #000 0%, transparent 78%)",
            }}
          />

          <div className="container-x relative z-10">
            <h2
              className="text-white"
              style={{ fontSize: "clamp(38px, 5.4vw, 84px)", lineHeight: 0.98, letterSpacing: "-0.01em" }}
            >
              Выгоды
              <br />
              для клиента
            </h2>
            <p
              className="mt-7 max-w-[560px] font-body text-white/60"
              style={{ fontSize: "clamp(17px, 1.5vw, 21px)", lineHeight: 1.4 }}
            >
              Индивидуальный результат{" "}
              <span className="text-orange">в управляемом процессе</span>.
            </p>

            <div className="mt-14 h-px w-full bg-white/15 md:mt-16" />

            {/* Цифра-призрак стоит фоном за текстом пункта */}
            <div className="mt-12 grid gap-x-10 gap-y-12 md:mt-16 md:grid-cols-3 md:gap-x-14 md:gap-y-16">
              {benefits.map((benefit, index) => (
                <div key={benefit} className="relative pt-9 md:pt-11">
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 select-none font-mono"
                    style={{
                      fontSize: "clamp(72px, 6.4vw, 116px)",
                      fontWeight: 500,
                      lineHeight: 0.74,
                      color: "rgba(255,255,255,0.13)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p
                    className="relative max-w-[340px] font-body text-white/85"
                    style={{ fontSize: "clamp(17px, 1.4vw, 20px)", lineHeight: 1.35 }}
                  >
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
