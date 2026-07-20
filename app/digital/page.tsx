import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";
import GridLines from "../components/GridLines";
import Nav from "../components/Nav";
import ServicesHero from "../components/ServicesHero";
import ServicesStack from "../components/ServicesStack";

export default function DigitalPage() {
  return (
    <>
      <Nav />
      <main>
        <ServicesHero />

        <section className="relative border-t border-black/10 bg-paper py-16 md:py-24">
          <GridLines theme="light" count={5} />
          <div className="container-x relative z-10">
            <div className="grid gap-10 md:grid-cols-[0.55fr_1.25fr_0.7fr] md:gap-16">
              <div>
                <span className="eyebrow text-ink/55">Компания</span>
              </div>
              <p className="max-w-[680px] font-body text-[clamp(21px,2.25vw,34px)] leading-[1.35] text-ink">
                Мы берем на себя весь путь: от идеи до реализации, объединяя архитектуру, цифровое проектирование, производство, логистику и монтаж в единую управляемую систему.
              </p>
              <p className="max-w-[330px] font-body text-[14px] leading-[1.5] text-ink/60 md:pt-1">
                Подключаемся на любой стадии и формируем команду под задачу. Проектируем, рассчитываем, координируем, производим и собираем.
              </p>
            </div>
          </div>
        </section>

        <ServicesStack />

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
