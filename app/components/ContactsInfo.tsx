import SectionHead from "./SectionHead";

const address = "125040 Москва, Ленинградский проспект, д. 15 стр. 14, 4 этаж";

const cards = [
  {
    label: "Адрес",
    value: address,
    href: "#map",
    cta: "Показать на карте",
  },
  {
    label: "Телефон",
    value: "+7 495 664 28 23",
    href: "tel:+74956642823",
    cta: "Позвонить",
  },
  {
    label: "Почта",
    value: "office@sk-struktura.ru",
    href: "mailto:office@sk-struktura.ru",
    cta: "Написать",
  },
];

export default function ContactsInfo() {
  return (
    <section className="bg-paper pb-16 pt-28 md:pb-24 md:pt-32">
      <div className="container-x">
        <SectionHead index="01" kicker="Контакты" theme="light" />
        <div className="grid border-l border-t border-black/10 sm:grid-cols-3">
          {cards.map((card) => (
            <a
              key={card.label}
              href={card.href}
              className="group relative flex min-h-[220px] flex-col justify-between border-b border-r border-black/10 p-6 transition-colors hover:bg-black/[0.02] md:min-h-[250px] md:p-8"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">{card.label}</span>
              <div>
                <p className="font-body text-[17px] leading-[1.4] text-ink md:text-[19px]">{card.value}</p>
                <span className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.16em] text-orange transition-colors group-hover:text-ink">
                  {card.cta} →
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
