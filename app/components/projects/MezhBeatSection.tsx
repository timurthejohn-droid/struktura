import Reveal from "../materials/Reveal";
import StoryFrame from "./StoryFrame";

export type MezhBeat = {
  id: string;
  index: string;
  title: string;
  body: string;
  image: string;
  alt: string;
  imageOnLeft?: boolean;
  stat?: { value: string; label: string };
};

export default function MezhBeatSection({ beat }: { beat: MezhBeat }) {
  return (
    <section id={beat.id} className="border-t border-black/10 bg-paper">
      <div className="grid md:grid-cols-2">
        <div className={beat.imageOnLeft ? "order-1 md:order-1" : "order-1 md:order-2"}>
          <StoryFrame src={beat.image} alt={beat.alt} className="min-h-[360px] md:min-h-[640px]" />
        </div>
        <div className={`${beat.imageOnLeft ? "md:order-2" : "md:order-1"} order-2 flex flex-col justify-center px-6 py-16 md:px-16 md:py-20`}>
          <Reveal>
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-orange">{beat.index}</span>
            <h2 className="mt-5 max-w-[480px] text-ink" style={{ fontSize: "clamp(28px,3.2vw,44px)", lineHeight: 1.08 }}>
              {beat.title}
            </h2>
            <p className="mt-8 max-w-[480px] font-body text-[15px] leading-[1.65] text-ink/70">{beat.body}</p>

            {beat.stat && (
              <div className="mt-12 flex items-baseline gap-5">
                <span className="font-mono text-[56px] leading-none text-orange md:text-[68px]">{beat.stat.value}</span>
                <span className="max-w-[180px] font-body text-[13px] leading-[1.4] text-ink/55">{beat.stat.label}</span>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
