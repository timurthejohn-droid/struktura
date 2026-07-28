import type { Metadata } from "next";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import ContactForm from "../../components/ContactForm";
import MezhHero from "../../components/projects/MezhHero";
import MezhFacts from "../../components/projects/MezhFacts";
import MezhBeatSection, { type MezhBeat } from "../../components/projects/MezhBeatSection";
import MezhTimeline from "../../components/projects/MezhTimeline";
import MezhClosing from "../../components/projects/MezhClosing";

export const metadata: Metadata = {
  title: "Межбашенное пространство — Сбербанк-Сити | STRUKTURA+",
  description:
    "Купол архитектурного бюро Evolution Design, объединяющий башни Сбербанк-Сити — первая конструкция такого масштаба в России. Алгоритмическое проектирование, производство в трёх странах и монтаж силами STRUKTURA+.",
};

const beats: MezhBeat[] = [
  {
    id: "concept",
    index: "01 · Замысел",
    title: "Купол, который держит образ комплекса",
    body: "Проект бюро «Evolution Design» связывает две башни Сбербанк-Сити в единую композицию и становится главной внешней доминантой штаб-квартиры — точкой, ради которой считывается весь комплекс.",
    image: "/projects/mezhbashennoye/gallery-4.jpg",
    alt: "Купол между двумя башнями Сбербанк-Сити, вид с площади",
    imageOnLeft: true,
  },
  {
    id: "engineering",
    index: "02 · Инженерия",
    title: "Цифровая модель вместо чертежей вручную",
    body: "Проект полностью реализован с использованием алгоритмического проектирования — включая разработку всей конструкторской документации. В партнёрстве с «Макрофабрикой» создана уникальная система силовой подконструкции, утепления и гидроизоляции.",
    image: "/projects/mezhbashennoye/gallery-2.jpg",
    alt: "Стальной каркас купола изнутри атриума",
    stat: { value: "100%", label: "конструкторской документации — в единой цифровой модели" },
  },
  {
    id: "production",
    index: "03 · Производство",
    title: "Панели, рождённые в трёх странах",
    body: "Декоративные панели купола изготавливались по спецзаказу: нестандартные размеры листов потребовали производства сразу в трёх странах, прежде чем элементы собрались в единую оболочку на площадке.",
    image: "/projects/mezhbashennoye/gallery-7.jpg",
    alt: "Крупный план треугольных панелей облицовки купола",
    imageOnLeft: true,
    stat: { value: "3", label: "страны-производителя нестандартных панелей" },
  },
  {
    id: "result",
    index: "04 · Пространство",
    title: "Купол, который стал площадью",
    body: "Под оболочкой раскрывается атриум, объединяющий обе башни в общее пространство: кафе, зоны отдыха и постоянный поток людей — то, ради чего просчитывалась каждая деталь конструкции.",
    image: "/projects/mezhbashennoye/gallery-6.jpg",
    alt: "Атриум внутри купола с зонами отдыха и людьми",
  },
];

export default function MezhbashennoyeProstranstvoPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper">
        <MezhHero />
        <MezhFacts />
        {beats.map((beat) => (
          <MezhBeatSection key={beat.id} beat={beat} />
        ))}
        <MezhTimeline />
        <MezhClosing />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
