const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const image = "/projects/mezhbashennoye/gallery-6.jpg";

// Смысловая пауза между вакансиями и формой: кадр реализованного объекта
// и заявление о том, кого мы ищем.

export default function CareersBand() {
  return (
    <section className="relative overflow-hidden bg-coal">
      <img
        src={`${basePath}${image}`}
        alt="Монтаж металлоконструкций на объекте STRUKTURA"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />

      <div className="container-x relative flex min-h-[420px] flex-col justify-end py-16 md:min-h-[560px] md:py-24">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-orange">Кого мы ищем</p>
        <h2
          className="mt-6 max-w-[900px] text-white"
          style={{ fontSize: "clamp(26px,3.8vw,56px)", lineHeight: 1.06, letterSpacing: "-0.01em" }}
        >
          Специалистов, готовых к вызовам и стремящихся изменить будущее
        </h2>
        <p className="mt-7 max-w-[520px] font-body text-[15px] leading-[1.6] text-white/70 md:text-[17px]">
          Каждый проект здесь — нестандартная геометрия и инженерная задача без готового решения.
          Отвечаем на резюме в течение рабочей недели.
        </p>
      </div>
    </section>
  );
}
