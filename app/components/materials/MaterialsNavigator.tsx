import SectionHead from "../SectionHead";
import Reveal from "./Reveal";
import CapabilityExplorer from "./CapabilityExplorer";

// [02] КАТАЛОГ ВОЗМОЖНОСТЕЙ — всё в одном окне.
// Слева список 9 возможностей → клик → внутреннее меню материалов
// с кнопкой «Назад»; справа — панель материала.

export default function MaterialsNavigator() {
  return (
    <section id="navigator" className="py-24 md:py-36" style={{ background: "var(--paper)" }}>
      <div className="container-x">
        <SectionHead index="02" kicker="Каталог возможностей" theme="light" />

        <Reveal>
          <p className="font-body text-ink-soft max-w-2xl mb-12" style={{ fontSize: "clamp(16px, 1.3vw, 20px)", lineHeight: 1.6 }}>
            Ищите не&nbsp;сплав, а&nbsp;архитектурную возможность. Выберите раздел&nbsp;—
            внутри материалы, их&nbsp;характеристики, наши проекты и&nbsp;мировые кейсы.
          </p>

          <CapabilityExplorer />
        </Reveal>
      </div>
    </section>
  );
}
