// Матрица «материал × возможность» — двунаправленный слой поверх materialsData.
// Позволяет читать каталог в обе стороны:
//   возможность → материалы (как сейчас на /materials)
//   материал → возможности (новый вход, лаборатория /lab/materials-a|b)
//
// Три положительных уровня, отрицательные пары просто отсутствуют:
//   proven    — доказано проектом (выводится автоматически, см. levelFor)
//   standard  — стандартная для нас работа
//   possible  — можно разработать: считаем, прототипируем, подтверждаем образцом
//
// ВАЖНО: «proven» нельзя проставить вручную. Он появляется только там, где
// для пары есть размеченный кейс в CONTENT — матрица не может соврать,
// потому что клик по ячейке обязан показать доказательство.

import { CAPABILITIES, CONTENT, MATERIALS, CaseItem } from "./materialsData";

export type Level = "proven" | "standard" | "possible";

export const LEVEL_LABEL: Record<Level, string> = {
  proven: "Доказано проектом",
  standard: "Стандартно",
  possible: "Можно разработать",
};

// Радиус на радаре и вес в сортировке
export const LEVEL_R: Record<Level, number> = {
  proven: 1,
  standard: 0.72,
  possible: 0.44,
};

export const LEVEL_RANK: Record<Level, number> = { proven: 3, standard: 2, possible: 1 };

// Короткие подписи для осей радара и заголовков матрицы
export const CAP_SHORT: Record<string, string> = {
  forma: "Форма",
  masshtab: "Масштаб",
  kinetika: "Кинетика",
  svet: "Свет",
  soedineniya: "Соединения",
  funktsii: "Функции",
  legkost: "Лёгкость",
  poverhnost: "Поверхность",
  additive: "Аддитив",
};

// ————————————————————————————————————————————————————————————
// Базовая матрица: инженерная оценка «стандартно / можно разработать».
// Пары, доказанные кейсами, поднимаются до proven автоматически.
// ————————————————————————————————————————————————————————————

type Row = Partial<Record<string, Level>>;

export const MATRIX: Record<string, Row> = {
  // ——— МЕТАЛЛЫ ———
  "Металл премиум": {
    forma: "possible",
    svet: "standard",
    soedineniya: "possible",
    poverhnost: "standard",
  },
  "Нержавеющая сталь": {
    forma: "standard",
    masshtab: "standard",
    kinetika: "standard",
    svet: "standard",
    soedineniya: "standard",
    funktsii: "standard",
    legkost: "possible",
    poverhnost: "standard",
  },
  Латунь: {
    forma: "possible",
    svet: "standard",
    soedineniya: "possible",
    funktsii: "possible",
    poverhnost: "standard",
  },
  Медь: {
    forma: "standard",
    masshtab: "possible",
    svet: "possible",
    soedineniya: "possible",
    poverhnost: "standard",
  },
  Бронза: {
    forma: "possible",
    svet: "possible",
    poverhnost: "standard",
    additive: "possible",
  },
  Алюминий: {
    forma: "standard",
    masshtab: "standard",
    kinetika: "standard",
    svet: "possible",
    soedineniya: "standard",
    funktsii: "standard",
    legkost: "standard",
    poverhnost: "standard",
    additive: "possible",
  },
  Титан: {
    forma: "standard",
    masshtab: "possible",
    kinetika: "standard",
    svet: "possible",
    soedineniya: "possible",
    legkost: "standard",
    poverhnost: "possible",
  },
  "Кортеновская сталь": {
    forma: "possible",
    masshtab: "possible",
    soedineniya: "possible",
    poverhnost: "standard",
  },
  "Шпон на металле": {
    forma: "possible",
    soedineniya: "standard",
    funktsii: "standard",
    legkost: "possible",
    poverhnost: "standard",
  },
  "Сотовая панель": {
    forma: "standard",
    masshtab: "standard",
    kinetika: "standard",
    soedineniya: "standard",
    funktsii: "standard",
    legkost: "standard",
    poverhnost: "possible",
  },
  Антифингерпринт: {
    svet: "possible",
    poverhnost: "standard",
  },

  // ——— СТЕКЛО ———
  Стекло: {
    forma: "standard",
    masshtab: "standard",
    kinetika: "possible",
    svet: "standard",
    soedineniya: "standard",
    funktsii: "possible",
    poverhnost: "possible",
  },
  "Дутое стекло": {
    forma: "standard",
    svet: "standard",
    poverhnost: "standard",
  },
  Хрусталь: {
    forma: "possible",
    svet: "standard",
    poverhnost: "possible",
  },
  Зеркало: {
    forma: "possible",
    masshtab: "possible",
    svet: "standard",
    soedineniya: "possible",
  },

  // ——— ДЕРЕВО И ГИБРИДЫ ———
  Шпонирование: {
    forma: "possible",
    funktsii: "possible",
    poverhnost: "standard",
  },
  "Сублимация по дереву": {
    masshtab: "possible",
    funktsii: "possible",
    poverhnost: "standard",
  },
  "Анодировка по дереву": {
    masshtab: "standard",
    kinetika: "possible",
    legkost: "possible",
    poverhnost: "standard",
  },

  // ——— МИНЕРАЛЬНЫЕ ———
  "Натуральный камень": {
    forma: "possible",
    masshtab: "standard",
    svet: "standard",
    soedineniya: "standard",
    legkost: "possible",
    poverhnost: "standard",
  },
  Керамика: {
    forma: "possible",
    masshtab: "standard",
    soedineniya: "standard",
    funktsii: "standard",
    legkost: "possible",
    poverhnost: "standard",
  },
  Фиброцемент: {
    forma: "possible",
    masshtab: "standard",
    soedineniya: "possible",
    funktsii: "possible",
    poverhnost: "standard",
  },
  Фиброгипс: {
    forma: "possible",
    soedineniya: "possible",
    funktsii: "standard",
    poverhnost: "possible",
  },

  // ——— АКУСТИКА ———
  "Акустическая панель": {
    forma: "standard",
    soedineniya: "possible",
    funktsii: "standard",
    legkost: "possible",
    poverhnost: "standard",
  },
  Звукопоглощение: {
    forma: "possible",
    funktsii: "standard",
    legkost: "standard",
  },

  // ——— СЛОЖНЫЕ ———
  PVD: {
    forma: "standard",
    masshtab: "possible",
    kinetika: "possible",
    svet: "standard",
    poverhnost: "standard",
  },
  "Искусственный камень": {
    forma: "standard",
    masshtab: "possible",
    soedineniya: "standard",
    funktsii: "possible",
    legkost: "possible",
    poverhnost: "standard",
    additive: "standard",
  },
  "Вспененная керамика": {
    forma: "standard",
    svet: "possible",
    funktsii: "standard",
    legkost: "standard",
    poverhnost: "standard",
    additive: "standard",
  },
  Фибробетон: {
    forma: "standard",
    masshtab: "possible",
    svet: "possible",
    funktsii: "possible",
    legkost: "standard",
    poverhnost: "standard",
    additive: "standard",
  },
  "3D-печать панели": {
    forma: "standard",
    masshtab: "standard",
    soedineniya: "possible",
    funktsii: "possible",
    legkost: "standard",
    poverhnost: "standard",
    additive: "standard",
  },
};

// ————————————————————————————————————————————————————————————
// Разметка контента: какой кейс/статья какую возможность доказывает.
// Ключ — заголовок карточки из CONTENT (кейс один и тот же, в каких бы
// материалах он ни появлялся, поэтому разметка сквозная).
// ————————————————————————————————————————————————————————————

export const CASE_CAPS: Record<string, string[]> = {
  // — наши проекты —
  "Зеркальный куб WinePark": ["masshtab", "forma", "svet", "legkost", "soedineniya"],
  "Панно Moscow Towers": ["poverhnost", "svet"],
  "Лестница Сбер": ["poverhnost"],
  "Биоморфный арт-потолок": ["forma", "soedineniya", "funktsii"],
  "Подвесная переговорная": ["legkost", "soedineniya"],
  "Стеклянный пол Музея Кремля": ["svet", "soedineniya"],
  "Вентфасад FRESCO TERRACOTTA": ["soedineniya", "funktsii", "masshtab"],
  "Протокол испытаний № 622/КПТ-558-2024": ["poverhnost"],
  "Производство GRC-панелей": ["legkost", "forma", "additive"],
  "CNC-рельеф и декоративные экраны": ["poverhnost", "forma", "funktsii"],
  "Роботизированная печать": ["additive", "forma"],
  "Библиотека PVD-покрытий": ["poverhnost", "svet"],
  "Акустические стеновые панели": ["funktsii", "poverhnost"],
  "Винтовая лестница": ["funktsii", "forma"],

  // — статьи —
  "PVD: цвет, который выращивают в вакууме": ["poverhnost", "svet"],
  "Большие полотна: как победить термодеформации": ["masshtab", "svet"],
  "Благородные покрытия: от патины до чёрного хрома": ["poverhnost"],
  "Живая патина: материал, который стареет красиво": ["poverhnost"],
  "Временная шкала патины": ["poverhnost"],
  // формовка без матрицы — не аддитивка: лист продавливается, а не наращивается
  "Формовка без матрицы": ["forma"],
  "Ключ к крупной плоскости": ["masshtab", "legkost"],
  "Дихроичное стекло: цвет, которого нет на палитре": ["svet", "poverhnost"],
  "Фритта: печать, впечённая навсегда": ["svet", "poverhnost", "funktsii"],
  "Просвечивающий камень": ["svet"],
  "Гибкий каменный шпон": ["forma", "legkost"],
  "КЛТР 41–58: как крепить бесшовное": ["soedineniya", "forma"],
  "Бионика, которую можно фрезеровать": ["forma", "legkost", "funktsii"],
  "Форма без каталога": ["additive", "forma"],
  "×10 твёрже гальваники": ["poverhnost"],
  "Разрез: облицовка / зазор / поглотитель": ["funktsii"],
  "Библиотека распилов": ["poverhnost"],
  "Дерево с геометрической дисциплиной": ["poverhnost", "soedineniya"],

  // — мировые кейсы —
  "Cloud Gate": ["soedineniya", "forma", "svet"],
  "Disney Concert Hall": ["forma", "masshtab"],
  "Bund Financial Centre": ["kinetika", "poverhnost", "masshtab", "svet"],
  "Fraunhofer TZA": ["poverhnost", "svet", "funktsii"],
  Bullion: ["poverhnost", "svet"],
  "Aman New York": ["poverhnost"],
  "de Young Museum": ["poverhnost", "forma", "funktsii"],
  "Guggenheim Bilbao": ["forma", "masshtab", "legkost", "poverhnost"],
  "Angel of the North": ["poverhnost", "masshtab"],
  "Dongdaemun Design Plaza": ["forma", "masshtab", "soedineniya"],
  "Scott Hall": ["svet", "poverhnost"],
  "Getty Center": ["poverhnost", "masshtab"],
  "Museum Brandhorst": ["soedineniya", "funktsii", "poverhnost"],
  "Whitney Museum": ["poverhnost", "masshtab"],
  "1111 Lincoln Road": ["poverhnost", "masshtab"],
  Masaryčka: ["soedineniya", "forma", "poverhnost"],
  "Varna Wave": ["soedineniya", "forma"],
  MuCEM: ["forma", "svet", "legkost"],
  "The Broad": ["forma", "svet", "funktsii", "additive"],
  "Heydar Aliyev Centre": ["forma", "legkost", "masshtab"],
  OctaFoam: ["forma", "legkost", "funktsii", "additive"],
};

// ————————————————————————————————————————————————————————————
// Производные функции
// ————————————————————————————————————————————————————————————

export type Proof = {
  projects: CaseItem[];
  articles: CaseItem[];
  world: CaseItem[];
  total: number;
};

const EMPTY: Proof = { projects: [], articles: [], world: [], total: 0 };

/** Кейсы, статьи и мировые референсы, доказывающие пару «материал × возможность». */
export function proofFor(material: string, cap: string): Proof {
  const c = CONTENT[material];
  if (!c) return EMPTY;
  const pick = (items?: CaseItem[]) =>
    (items ?? []).filter((it) => (CASE_CAPS[it.title] ?? []).includes(cap));
  const projects = pick(c.projects);
  const articles = pick(c.articles);
  const world = pick(c.world);
  return { projects, articles, world, total: projects.length + articles.length + world.length };
}

/** Весь контент материала — для «мягкого запаса», когда по паре пусто. */
export function allContent(material: string): Proof {
  const c = CONTENT[material];
  if (!c) return EMPTY;
  const projects = c.projects ?? [];
  const articles = c.articles ?? [];
  const world = c.world ?? [];
  return { projects, articles, world, total: projects.length + articles.length + world.length };
}

/**
 * Уровень пары. proven выигрывает всегда: если доказательство есть — оно
 * сильнее любой ручной оценки, и матрица самозалечивается на пропусках.
 */
export function levelFor(material: string, cap: string): Level | null {
  if (proofFor(material, cap).total > 0) return "proven";
  return MATRIX[material]?.[cap] ?? null;
}

/** Профиль материала: уровень по каждой из 9 возможностей (null = нет). */
export function profileOf(material: string): Record<string, Level | null> {
  const out: Record<string, Level | null> = {};
  CAPABILITIES.forEach((c) => {
    out[c.slug] = levelFor(material, c.slug);
  });
  return out;
}

/** Возможности материала, отсортированные от сильных к слабым. */
export function capsOf(material: string) {
  return CAPABILITIES.map((c) => ({ cap: c, level: levelFor(material, c.slug) }))
    .filter((x): x is { cap: (typeof CAPABILITIES)[number]; level: Level } => x.level !== null)
    .sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level]);
}

/** Материалы возможности, отсортированные от сильных к слабым. */
export function materialsOf(cap: string) {
  return MATERIALS.map((m) => ({ material: m, level: levelFor(m.name, cap) }))
    .filter((x): x is { material: (typeof MATERIALS)[number]; level: Level } => x.level !== null)
    .sort((a, b) => LEVEL_RANK[b.level] - LEVEL_RANK[a.level]);
}

/** Сколько всего связей в матрице — для подписи под каталогом. */
export function matrixStats() {
  let proven = 0;
  let standard = 0;
  let possible = 0;
  MATERIALS.forEach((m) =>
    CAPABILITIES.forEach((c) => {
      const l = levelFor(m.name, c.slug);
      if (l === "proven") proven++;
      else if (l === "standard") standard++;
      else if (l === "possible") possible++;
    })
  );
  return { proven, standard, possible, total: proven + standard + possible };
}
