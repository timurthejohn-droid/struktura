import Footer from "../components/Footer";
import Nav from "../components/Nav";
import ProjectsCatalog, { type Project } from "../components/ProjectsCatalog";
import ContactForm from "../components/ContactForm";

const projects: Project[] = [
  {
    number: "01",
    name: "Сбербанк-Сити",
    year: "2022",
    work: "Межбашенное пространство",
    category: "Фасады",
    image: "/projects/37785448.jpg",
    featured: true,
  },
  {
    number: "02",
    name: "Moscow Towers",
    year: "2024",
    work: "Монументальное художественное панно из металлических пластин",
    category: "Интерьеры",
    image: "/projects/68362468.jpg",
  },
  {
    number: "03",
    name: "Штаб-квартира крупного банка",
    year: "2020",
    work: "Арт потолок",
    category: "Интерьеры",
    image: "/projects/14200012.jpg",
  },
  {
    number: "04",
    name: "Сбербанк-Сити",
    year: "2019",
    work: "Подвесная переговорная и лестницы",
    category: "Общественные пространства",
    image: "/projects/50306000.jpg",
  },
  {
    number: "05",
    name: "Большая спортивная арена Лужники",
    year: "2016",
    work: "Подвесная вантовая лестница",
    category: "Общественные пространства",
    image: "/projects/95621109.jpg",
  },
  {
    number: "06",
    name: "Технопарк ИЦ Сколково",
    year: "2016",
    work: "Стеклянные павильоны",
    category: "Общественные пространства",
    image: "/projects/89633412.jpg",
  },
  {
    number: "07",
    name: "Парк Зарядье",
    year: "2018",
    work: "Флорариум",
    category: "Общественные пространства",
    image: "/projects/54631509.jpg",
  },
  {
    number: "08",
    name: "COMCITY",
    year: "2016",
    work: "Проектный менеджмент",
    category: "Фасады",
    image: "/projects/54298739.jpg",
  },
  {
    number: "09",
    name: "БЦ Оружейный",
    year: "2020",
    work: "Стеклянная скала",
    category: "Фасады",
    image: "/projects/60699651.jpg",
  },
];

export default function ProjectsPage() {
  return (
    <>
      <Nav />
      <main className="bg-paper">
        <ProjectsCatalog projects={projects} />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
