import GridLines from "./GridLines";

export default function ContactsHero() {
  return (
    <section className="relative flex min-h-[560px] flex-col overflow-hidden bg-paper md:min-h-[620px]">
      <GridLines theme="light" count={5} />
      <div className="container-x relative z-10 flex w-full flex-1 flex-col pb-8 pt-24 md:pt-28">
        <div className="flex items-center justify-between border-b border-black/10 pb-4 rise-in" style={{ animationDelay: "0.05s" }}>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Контакты</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink/45">Москва</span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10 md:py-14">
          <h1 className="max-w-[1160px] text-[clamp(40px,7.3vw,108px)] leading-[0.94] text-ink rise-in" style={{ animationDelay: "0.18s" }}>
            Свяжитесь<br /><span className="text-orange">с нами</span>
          </h1>
        </div>

        <div className="border-t border-black/10 pt-6 rise-in" style={{ animationDelay: "0.3s" }}>
          <div className="grid items-end gap-7 lg:grid-cols-[1fr_auto] lg:gap-16">
            <p className="max-w-[680px] font-body text-[clamp(15px,1.2vw,19px)] leading-[1.55] text-ink/60">
              Опишите задачу — ответим в течение рабочего дня.
            </p>
            <a href="#contact" className="btn btn-orange">Оставить заявку</a>
          </div>
        </div>
      </div>
    </section>
  );
}
