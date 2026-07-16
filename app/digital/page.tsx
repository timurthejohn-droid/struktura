import Nav from "../components/Nav";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

const stages = [
  {
    title: "Предпроект",
    body: [
      "Формируется архитектурная концепция, определяются технические ограничения, бюджетные рамки и сроки реализации.",
      "STRUKTURA подключает инженерную экспертизу на ранней стадии, проводит предварительный BIM-анализ сложных зон и формирует техническую стратегию проекта.",
    ],
  },
  {
    title: "R&D",
    body: [
      "Разработка нестандартных узлов, подсистем, креплений и решений под конкретную архитектуру.",
      "Цифровая среда помогает быстро проверять гипотезы, согласовывать эстетику и инженерию, исключать непроизводимые конструкции.",
    ],
  },
  {
    title: "Проектирование",
    body: [
      "Разработка рабочей документации, интеграция подсистем в общую модель и подготовка данных к производству.",
      "BIM-среда, координация разделов и детальная модель снижают риск коллизий и ошибок передачи данных.",
    ],
  },
  {
    title: "Производство",
    body: [
      "Мы организуем и управляем производством под специфику задачи проекта, подбираем исполнителей и контролируем каждый этап создания элементов.",
      "Модель создается с учетом производства: данные передаются напрямую из цифровой модели, а качество контролируется до выхода на объект.",
    ],
  },
  {
    title: "Логистика",
    body: [
      "Поставки координируются по графику монтажа, с учетом упаковки, маркировки, хранения и особенностей материала.",
      "Единая система QR-кодов и автоматизации логистики снижает риски несинхронной поставки и повреждения элементов.",
    ],
  },
  {
    title: "Монтаж",
    body: [
      "Финальная интеграция решений на площадке с шеф-монтажом, авторским контролем и проверкой геометрии перед установкой.",
      "Монтажная команда работает в едином проектном графике и получает инженерную поддержку при изменениях.",
    ],
  },
];

const process = ["Предпроект", "R&D", "Проектирование", "Производство", "Логистика", "Монтаж"];

function MediaPlaceholder() {
  return (
    <div className="flex min-h-[360px] items-center justify-center bg-[#c7c7c7]" aria-hidden="true">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-ink/70">
        <rect x="4" y="4" width="16" height="16" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="9" cy="9" r="1.4" fill="currentColor" />
        <path d="M6.5 17L11 12.5L14 15.5L16 13.5L18 15.5" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </div>
  );
}

export default function DigitalPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper">
        <section className="pt-28 md:pt-32">
          <div className="container-x">
            <div className="flex min-h-[420px] items-end bg-[#cdcdcd] px-6 py-10 md:min-h-[610px] md:px-12 md:py-14">
              <h1
                className="max-w-[1050px] text-ink"
                style={{ fontSize: "clamp(38px, 5vw, 58px)", lineHeight: 1.1, letterSpacing: "-0.03em" }}
              >
                Цифровая среда STRUKTURA+
              </h1>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container-x grid gap-12 md:grid-cols-2 md:gap-20">
            <div>
              <h2 className="max-w-[560px] text-ink" style={{ fontSize: "clamp(24px, 2.4vw, 32px)", lineHeight: 1.2 }}>
                Мы создали единую цифровую среду, которая связывает все этапы в одну систему
              </h2>
              <ul className="mt-10 list-disc space-y-2 pl-5 font-body text-[20px] leading-[1.25] text-ink">
                <li>BIM-моделирование всех элементов</li>
                <li>Расчет нагрузок и оптимизация материалов</li>
                <li>Генерация управляющих программ для станков</li>
                <li>Цифровой контроль от проектирования до монтажа</li>
              </ul>
            </div>

            <div className="md:pt-24">
              <p className="font-body text-[20px] leading-[1.25] text-ink">Что это дает:</p>
              <ul className="mt-4 list-disc space-y-2 pl-5 font-body text-[20px] leading-[1.25] text-ink">
                <li>данные не теряются при переходе между этапами</li>
                <li>решения проверяются до выхода на стройку</li>
                <li>производство и монтаж работают по одной модели</li>
                <li>все участники работают в единой логике</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="pb-16 md:pb-24">
          <div className="container-x">
            <h2
              className="text-center text-ink"
              style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              Цифровизация процессов
            </h2>
            <p className="mt-4 text-center font-body text-[20px] text-ink/70">
              Технологический стек: Grasshopper, Rhinoceros, Revit, Tekla, Recap и другие.
            </p>
            <div className="mt-12 grid gap-0 md:grid-cols-6">
              {process.map((item) => (
                <div key={item} className="min-h-[185px] border border-black/10 p-5">
                  <p className="font-body text-[14px] leading-[1.45] text-ink">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          {stages.map((stage, index) => (
            <div key={stage.title} className="border-t border-black/10">
              <div className="grid md:grid-cols-2">
                {index % 2 === 1 && <MediaPlaceholder />}
                <div className="px-6 py-16 md:px-12 md:py-20">
                  <h2
                    className="text-ink"
                    style={{ fontSize: "clamp(30px, 3.1vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
                  >
                    {stage.title}
                  </h2>
                  <div className="mt-10 max-w-[520px] space-y-5 font-body text-[14px] leading-[1.45] text-ink">
                    <p className="text-ink/50">Что происходит на этапе</p>
                    {stage.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
                {index % 2 === 0 && <MediaPlaceholder />}
              </div>
            </div>
          ))}
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
