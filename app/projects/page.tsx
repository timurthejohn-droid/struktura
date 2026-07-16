import Nav from "../components/Nav";
import ContactForm from "../components/ContactForm";
import Footer from "../components/Footer";

const categories = [
  { name: "Архитектурные фасады", count: "5 кейсов" },
  { name: "Культурные и спортивные сооружения с уникальной геометрией", count: "5 кейсов" },
  { name: "Промышленные комплексы с особыми требованиями", count: "5 кейсов" },
  { name: "Инфраструктурные и городские пространства", count: "5 кейсов" },
  { name: "Объекты госконтрактов и международные экспортные проекты", count: "5 кейсов" },
];

const projects = [
  {
    n: "01",
    name: "Сбербанк-Сити",
    text: "Мы создали уникальную силовую подконструкцию и систему утепления и гидроизоляции, обеспечив надежность и долговечность архитектурного решения.",
  },
  {
    n: "02",
    name: "Лахта Центр",
    text: "Инженерная адаптация входной группы со сложной геометрией, производственной логикой и точной последовательностью монтажа.",
  },
  {
    n: "03",
    name: "Музей Кремля",
    text: "Стеклянные и металлические решения для общественного пространства, где визуальная легкость требует высокой инженерной точности.",
  },
  {
    n: "04",
    name: "Москва-Сити",
    text: "Фасадные и интерьерные элементы с нестандартной геометрией, подготовленные к производству и монтажу без потери архитектурной идеи.",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper">
        <section className="pt-28 md:pt-32">
          <div className="container-x">
            <div className="min-h-[360px] bg-[#cdcdcd] px-6 py-10 md:min-h-[520px] md:px-12 md:py-16">
              <h1
                className="max-w-[980px] text-ink"
                style={{ fontSize: "clamp(38px, 5vw, 58px)", lineHeight: 1.12, letterSpacing: "-0.03em" }}
              >
                Мы можем всё. И даже больше
              </h1>
              <p
                className="mt-12 max-w-[430px] text-ink"
                style={{ fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.16, letterSpacing: "-0.02em" }}
              >
                Превращаем сложные архитектурные идеи в реализованные объекты
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container-x">
            <h2
              className="text-center text-ink"
              style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
            >
              Наши объекты включают
            </h2>
            <div className="mt-10 grid gap-3 md:grid-cols-5">
              {categories.map((category) => (
                <div key={category.name} className="min-h-[190px] border border-black/10 p-5">
                  <p className="font-body text-[14px] leading-[1.45] text-ink">{category.name}</p>
                  <p className="mt-2 font-body text-[14px] leading-[1.45] text-ink/30">{category.count}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section>
          {projects.map((project) => (
            <article key={project.n} className="border-t border-black/10">
              <div className="container-x grid gap-8 py-12 md:grid-cols-2 md:gap-12 md:py-14">
                <div className="min-h-[280px] bg-[#d9d9d9] md:min-h-[420px]" />
                <div className="flex flex-col justify-between border-l border-black/10 pl-0 md:pl-12">
                  <div>
                    <div className="flex items-start justify-between gap-8">
                      <h2
                        className="text-ink"
                        style={{ fontSize: "clamp(28px, 3vw, 42px)", lineHeight: 1.05, letterSpacing: "-0.02em" }}
                      >
                        {project.name}
                      </h2>
                      <span className="font-mono text-[12px] uppercase text-ink/30">{project.n}</span>
                    </div>
                    <p className="mt-8 max-w-[460px] font-body text-[14px] leading-[1.45] text-ink/60">
                      {project.text}
                    </p>
                  </div>
                  <a
                    href={`/projects/${project.n}`}
                    className="mt-16 flex h-[90px] w-[90px] items-center justify-center rounded-full border border-black/10 font-mono text-[18px] text-ink transition-colors hover:border-orange hover:text-orange"
                    aria-label={`Открыть проект ${project.name}`}
                  >
                    →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </section>

        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
