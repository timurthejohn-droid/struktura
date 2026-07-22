// Изображения раздела. Правило: ничего не подставляем «похожее» —
// фото привязывается к кейсу только если это буквально тот же объект.
// Остальное честно уходит в оформленный слот под фото клиента.

export const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** Фото наших проектов — совпадения с каталогом /projects. */
export const CASE_IMAGE: Record<string, string> = {
  "Панно Moscow Towers": "/projects/68362468.jpg", // Moscow Towers, 2024 — панно из пластин
  "Биоморфный арт-потолок": "/projects/14200012.jpg", // Штаб-квартира банка, 2020 — арт-потолок
  "Подвесная переговорная": "/projects/50306000.jpg", // Сбербанк-Сити, 2019 — переговорная и лестницы
  "Лестница Сбер": "/projects/50306000.jpg", // тот же объект: лестницы Сбербанк-Сити
};

/** Съёмка материала — там, где она есть. */
export const MATERIAL_IMAGE: Record<string, string> = {
  Латунь: "/materials/pane2.jpg",
  Стекло: "/materials/glass2.jpg",
};

export function withBase(path: string) {
  return `${BP}${path}`;
}
