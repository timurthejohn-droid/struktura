import GridLines from "./GridLines";
import HeroPlus, { LOGO_THICKNESS } from "./HeroPlus";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[680px] md:min-h-[760px] lg:min-h-[820px] flex flex-col overflow-hidden"
      style={{
        // светлая сцена: тёплый «софтбокс» за плюсом, к краям — бумажный тон
        background:
          "radial-gradient(90% 95% at 76% 40%, #faf8f3 0%, #f4f2ec 46%, var(--paper) 100%)",
        borderBottom: "1px solid var(--line-light)",
      }}
    >
      <GridLines theme="light" count={5} />
      <div className="container-x w-full flex flex-col flex-1 pt-24 md:pt-28 pb-8 relative z-10">
        {/* Body — copy on the left, the metallic 3D plus on the right */}
        <div className="flex-1 grid items-center gap-x-10 lg:grid-cols-[1fr_1.08fr]">
          <div className="rise-in" style={{ animationDelay: "0.14s" }}>
            <h1
              className="text-ink"
              style={{
                fontSize: "clamp(30px, 4vw, 62px)",
                lineHeight: 1.0,
                letterSpacing: "-0.01em",
              }}
            >
              Превращаем
              <br />сложные&nbsp;идеи
              <br />в&nbsp;<span className="text-orange">реализованные</span> объекты
            </h1>

            <p
              className="font-body max-w-lg text-ink-soft rise-in mt-10"
              style={{
                fontSize: "clamp(15px, 1.2vw, 19px)",
                lineHeight: 1.55,
                animationDelay: "0.28s",
              }}
            >
              Объединяем проектирование, производство и&nbsp;монтаж в&nbsp;единую
              систему реализации сложных проектов.
            </p>

            <div className="mt-9 flex flex-wrap gap-3 rise-in" style={{ animationDelay: "0.36s" }}>
              <a href="#projects" className="btn btn-orange">
                Все проекты
              </a>
            </div>
          </div>

          {/* 3D plus */}
          <div
            className="relative my-6 h-[320px] md:h-[420px] fade-in lg:my-0 lg:h-[min(560px,58vh)]"
            style={{ animationDelay: "0.2s" }}
          >
            {/* Тёплое свечение за плюсом: на светлом фоне — обычное наложение, без screen */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(60% 62% at 50% 50%, rgba(255,90,0,0.16) 0%, rgba(255,90,0,0.06) 46%, rgba(255,90,0,0) 74%)",
              }}
            />
            {/* Мягкая тень-«пол» под плюсом, чтобы он стоял в кадре, а не парил */}
            <div
              className="absolute left-1/2 bottom-[6%] h-[7%] w-[46%] -translate-x-1/2 pointer-events-none"
              style={{
                background: "radial-gradient(50% 50% at 50% 50%, rgba(60,40,24,0.18) 0%, rgba(60,40,24,0) 100%)",
                filter: "blur(6px)",
              }}
            />
            <HeroPlus thickness={LOGO_THICKNESS} />
          </div>
        </div>
      </div>
    </section>
  );
}
