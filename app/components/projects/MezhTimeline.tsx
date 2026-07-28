import Reveal from "../materials/Reveal";
import DigitalPipeline from "../DigitalPipeline";

const stages = [
  { n: "01", slug: "concept", title: "Концепция" },
  { n: "02", slug: "engineering", title: "Инженерия" },
  { n: "03", slug: "production", title: "Производство" },
  { n: "04", slug: "result", title: "Монтаж" },
];

export default function MezhTimeline() {
  return (
    <section className="border-t border-black/10 bg-paper py-16 md:py-24">
      <div className="container-x">
        <Reveal>
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-orange">Процесс</span>
          <h2 className="mt-5 max-w-[640px] text-ink" style={{ fontSize: "clamp(28px,3.2vw,44px)", lineHeight: 1.08 }}>
            Команда участвовала в проекте на всех этапах — от концептуальной разработки до финальной реализации
          </h2>
        </Reveal>
      </div>
      <DigitalPipeline stages={stages} />
    </section>
  );
}
