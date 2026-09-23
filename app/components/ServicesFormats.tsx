"use client";

import { motion } from "framer-motion";

const models = [
  {
    number: "01",
    title: "Комплексная\nреализация",
    lead: "Единая ответственность за результат",
    text: "Проектируем панели и подсистему, организуем производство, поставку и монтаж — от мастер-модели до готовой конструкции.",
    scope: "Проектирование · Панели · Подсистема · Производство · Логистика · Монтаж",
    note: "Рекомендуемый формат для наиболее сложных и технологически связанных проектов.",
    action: "Реализовать проект с STRUKTURA",
    featured: true,
    tag: "Рекомендуемый формат",
  },
  {
    number: "02",
    title: "Совместная\nреализация",
    lead: "Наш инжиниринг + выбранный производитель панелей",
    text: "Панели могут изготавливаться выбранным заказчиком производителем. STRUKTURA сохраняет мастер-модель, проектирует систему, задаёт требования производству и обеспечивает совместимость панелей, подсистемы и монтажа.",
    scope: "Мастер-модель · Проектирование · Подсистема · Интеграция производства · Контроль · Монтаж / шеф-монтаж",
    note: "Прямой договор с производителем панелей не исключает инженерную интеграцию и техническое сопровождение STRUKTURA из состава решения.",
    action: "Обсудить совместную реализацию",
  },
  {
    number: "03",
    title: "Подсистема\nSTRUKTURA",
    lead: "Собственный инженерный продукт",
    text: "Проектируем, производим и поставляем адаптивную силовую подсистему для сложных панелей и архитектурных поверхностей.",
    scope: "Расчёт · Параметрическое проектирование · КД · Производство · Маркировка · Шеф-монтаж",
    note: "Применяется при технически подготовленном проекте панелей и квалифицированном производителе. Проектирование подсистемы и контроль интерфейса с панелью являются неделимой частью продукта.",
    action: "Проверить применимость подсистемы",
  },
];

const reveal = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.72, ease: [0.23, 1, 0.32, 1] as const },
};

export default function ServicesFormats() {
  return (
    <>
      <section className="relative min-h-[calc(100svh-72px)] overflow-hidden bg-coal-deep pt-[72px]">
        <div aria-hidden className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.09)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.09)_1px,transparent_1px)] [background-size:clamp(72px,8vw,144px)_clamp(72px,8vw,144px)]" />

        <div className="container-x relative z-10 flex min-h-[calc(100svh-72px)] flex-col pb-8 pt-6 md:pb-12 md:pt-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.65, delay: 0.1 }} className="flex items-center justify-between border-b border-white/15 pb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-white/55">
            <span>STRUKTURA+ / Модели реализации</span><span>01—03</span>
          </motion.div>

          <div className="flex flex-1 flex-col justify-center py-12 md:py-16">
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="mb-6 font-mono text-[11px] uppercase tracking-[0.18em] text-orange">Адаптивная инженерная система</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.28, ease: [0.23, 1, 0.32, 1] }} className="max-w-[1120px] font-mono uppercase tracking-[-0.035em] text-white" style={{ fontSize: "clamp(42px, 7.1vw, 104px)", lineHeight: 0.92 }}>
              Один инженерный продукт. <span className="text-orange">Несколько моделей</span> реализации.
            </motion.h1>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.48 }} className="grid gap-8 border-t border-white/15 pt-6 lg:grid-cols-[minmax(0,620px)_1fr] lg:items-end lg:gap-20">
            <p className="font-body text-[15px] leading-[1.55] text-white/72 md:text-[18px]">В основе проектов STRUKTURA — силовая подсистема, параметрическое проектирование и сквозной цифровой цикл BIM-to-CAM. Мы отвечаем за весь результат или интегрируем систему в существующую производственную цепочку проекта.</p>
            <div className="lg:justify-self-end">
              <a href="#contact" className="btn btn-orange">Обсудить проект</a>
              <p className="mt-3 max-w-[330px] font-body text-[11px] leading-[1.4] text-white/45">Формат участия определяется после анализа проекта и границ ответственности сторон.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-coal-deep pb-16 pt-10 md:pb-28 md:pt-16">
        <div className="container-x">
          <motion.div {...reveal} className="mb-8 grid gap-5 border-b border-white/15 pb-6 md:mb-12 md:grid-cols-[.35fr_1fr] md:items-end">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-orange">Модели реализации</span>
            <p className="max-w-[570px] font-body text-[15px] leading-[1.5] text-white/55">Три способа распределить ответственность вокруг одного инженерного ядра.</p>
          </motion.div>
          <div className="border-t border-white/15">
            {models.map((model, index) => (
              <motion.article key={model.number} {...reveal} transition={{ ...reveal.transition, delay: index * 0.06 }} className="group relative grid overflow-hidden border-b border-white/15 bg-coal-deep lg:grid-cols-[.17fr_.67fr_1fr]">
                <div className={`absolute bottom-0 left-0 top-0 w-[3px] origin-top transition-transform duration-500 ${model.featured ? "scale-y-100 bg-orange" : "scale-y-0 bg-orange group-hover:scale-y-100"}`} />
                <div className={`px-5 pb-0 pt-8 md:px-8 ${model.featured ? "lg:py-16" : "lg:py-12"}`}><span className={`font-body font-semibold leading-[.75] text-orange ${model.featured ? "text-[clamp(72px,8.4vw,124px)]" : "text-[clamp(60px,7vw,104px)]"}`}>{model.number}</span></div>
                <div className={`px-5 pb-8 pt-7 md:px-8 ${model.featured ? "lg:py-16" : "lg:py-12"}`}>
                  {model.tag ? <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.17em] text-orange">● {model.tag}</p> : null}
                  <p className={`mb-6 font-mono text-[10px] uppercase tracking-[0.17em] ${model.featured ? "text-white/70" : "text-white/40"}`}>{model.lead}</p>
                  <h2 className="whitespace-pre-line font-mono uppercase tracking-[-0.02em] text-white" style={{ fontSize: "clamp(29px, 3.7vw, 56px)", lineHeight: 0.97 }}>{model.title}</h2>
                </div>
                <div className={`flex flex-col justify-between px-5 pb-8 pt-0 md:px-8 ${model.featured ? "lg:py-16" : "lg:py-12"}`}>
                  <div>
                    <p className={`max-w-[530px] font-body text-[15px] leading-[1.55] ${model.featured ? "text-white/90" : "text-white/75"}`}>{model.text}</p>
                    <p className={`mt-7 border-t pt-4 font-mono text-[10px] uppercase leading-[1.55] tracking-[0.13em] ${model.featured ? "border-white/25 text-white/60" : "border-white/15 text-white/45"}`}>{model.scope}</p>
                    <p className={`mt-5 max-w-[530px] font-body text-[13px] leading-[1.5] ${model.featured ? "text-white/65" : "text-white/50"}`}>{model.note}</p>
                  </div>
                  <a href="#contact" className="mt-8 inline-flex items-center gap-4 self-start border-b border-orange/60 pb-2 font-mono text-[11px] uppercase tracking-[0.13em] text-white transition-[gap,color] duration-300 group-hover:gap-7 group-hover:text-orange">{model.action}<span aria-hidden>→</span></a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper py-16 text-ink md:py-28">
        <div className="container-x">
          <motion.div {...reveal} className="grid gap-10 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-orange">Принцип работы</span><h2 className="mt-6 font-mono uppercase tracking-[-0.035em] text-ink" style={{ fontSize: "clamp(42px, 6vw, 88px)", lineHeight: 0.9 }}>Это не три тарифа</h2></div>
            <div className="border-l-2 border-orange pl-6 md:pl-10">
              <p className="max-w-[710px] font-mono text-[clamp(20px,2.2vw,34px)] uppercase leading-[1.24] text-ink">Модель реализации определяется не исключением отдельных позиций из комплексного предложения, а фактической границей ответственности STRUKTURA.</p>
              <p className="mt-8 max-w-[650px] font-body text-[15px] leading-[1.6] text-ink/65 md:text-[17px]">При внешнем производстве панелей STRUKTURA сохраняет оплачиваемый инженерный контур в той части, в которой отвечает за интеграцию, совместимость и конечный результат.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#202020] py-16 md:py-28">
        <div aria-hidden className="absolute -right-24 -top-24 h-[430px] w-[430px] rounded-full border border-orange/35" />
        <div aria-hidden className="absolute -right-8 -top-8 h-[260px] w-[260px] rounded-full border border-white/15" />
        <motion.div {...reveal} className="container-x relative z-10 grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
          <div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-orange">Новый канал сотрудничества</span><h2 className="mt-6 max-w-[570px] font-mono uppercase tracking-[-0.025em] text-white" style={{ fontSize: "clamp(34px, 4.8vw, 70px)", lineHeight: 0.94 }}>Производителям панелей и материалов</h2></div>
          <div>
            <p className="max-w-[650px] font-body text-[17px] leading-[1.55] text-white/72 md:text-[20px]">Мы открыты к технологическому партнёрству с производителями керамики, камня, металла, композитов и других облицовочных материалов.</p>
            <p className="mt-6 max-w-[650px] font-body text-[14px] leading-[1.6] text-white/48 md:text-[16px]">STRUKTURA может интегрировать технологию вашего производства в единую цифровую систему проекта — от геометрии и креплений до подготовки данных и монтажа.</p>
            <a href="#contact" className="btn btn-orange mt-9">Стать технологическим партнёром</a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
