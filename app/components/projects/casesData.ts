export type CaseCategory = "Фасады" | "Интерьеры" | "Общественные пространства";

export type CaseFact = { label: string; value: string };

export type CaseItem = {
  number: string;
  slug: string;
  name: string;
  year: string;
  /** Что именно сделали — короткая формула работы */
  work: string;
  category: CaseCategory;
  image: string;
  /** Развёрнутая подпись под заголовком (по желанию) */
  summary?: string;
  /** Реальные факты проекта — выводятся строкой в панели */
  facts?: CaseFact[];
  /** Ссылка на страницу кейса, если она уже свёрстана */
  href?: string;
};

export const caseCategories: Array<CaseCategory | "Все"> = [
  "Все",
  "Фасады",
  "Интерьеры",
  "Общественные пространства",
];

export const cases: CaseItem[] = [
  {
    number: "01",
    slug: "mezhbashennoye-prostranstvo",
    name: "Сбербанк-Сити",
    year: "2022",
    work: "Межбашенное пространство",
    category: "Фасады",
    image: "/projects/37785448.jpg",
    summary:
      "Купол, объединяющий две башни штаб-квартиры в единый образ, — первая конструкция такого масштаба в России.",
    facts: [
      { label: "Архитектор", value: "Evolution Design" },
      { label: "Производство", value: "Макрофабрика" },
      { label: "Реализация", value: "2022" },
    ],
    href: "/projects/mezhbashennoye-prostranstvo",
  },
  {
    number: "02",
    slug: "moscow-towers",
    name: "Moscow Towers",
    year: "2024",
    work: "Монументальное художественное панно из металлических пластин",
    category: "Интерьеры",
    image: "/projects/68362468.jpg",
  },
  {
    number: "03",
    slug: "bank-hq-art-ceiling",
    name: "Штаб-квартира крупного банка",
    year: "2020",
    work: "Арт-потолок",
    category: "Интерьеры",
    image: "/projects/14200012.jpg",
  },
  {
    number: "04",
    slug: "sberbank-city-meeting-room",
    name: "Сбербанк-Сити",
    year: "2019",
    work: "Подвесная переговорная и лестницы",
    category: "Общественные пространства",
    image: "/projects/50306000.jpg",
  },
  {
    number: "05",
    slug: "luzhniki",
    name: "Большая спортивная арена «Лужники»",
    year: "2016",
    work: "Подвесная вантовая лестница",
    category: "Общественные пространства",
    image: "/projects/95621109.jpg",
  },
  {
    number: "06",
    slug: "skolkovo",
    name: "Технопарк ИЦ «Сколково»",
    year: "2016",
    work: "Стеклянные павильоны",
    category: "Общественные пространства",
    image: "/projects/89633412.jpg",
  },
  {
    number: "07",
    slug: "zaryadye",
    name: "Парк «Зарядье»",
    year: "2018",
    work: "Флорариум",
    category: "Общественные пространства",
    image: "/projects/54631509.jpg",
  },
  {
    number: "08",
    slug: "comcity",
    name: "COMCITY",
    year: "2016",
    work: "Проектный менеджмент",
    category: "Фасады",
    image: "/projects/54298739.jpg",
  },
  {
    number: "09",
    slug: "oruzheyny",
    name: "БЦ «Оружейный»",
    year: "2020",
    work: "Стеклянная скала",
    category: "Фасады",
    image: "/projects/60699651.jpg",
  },
];
