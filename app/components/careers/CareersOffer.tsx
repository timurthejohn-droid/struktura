import SectionHead from "../SectionHead";
import Reveal from "../materials/Reveal";
import { offers } from "./careersData";

export default function CareersOffer() {
  return (
    <section className="border-t border-black/10 bg-paper py-16 md:py-24">
      <div className="container-x">
        <SectionHead index="02" kicker="Мы предлагаем" theme="light" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
          <Reveal>
            <p className="max-w-[380px] font-body text-[clamp(16px,1.5vw,22px)] leading-[1.45] text-ink/70">
              Инженерная культура и живые проекты: то, из чего складывается рабочий день в
              <span className="text-ink"> STRUKTURA</span>.
            </p>
          </Reveal>

          <ol className="border-t border-black/10">
            {offers.map((offer, index) => (
              <li
                key={offer}
                className="grid grid-cols-[42px_minmax(0,1fr)] items-baseline gap-6 border-b border-black/10 py-5 md:grid-cols-[64px_minmax(0,1fr)] md:py-7"
              >
                <span className="font-mono text-[12px] tracking-[0.14em] text-orange">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="font-body text-[15px] leading-[1.5] text-ink md:text-[18px]">{offer}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
