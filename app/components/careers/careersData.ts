export type Vacancy = {
  number: string;
  title: string;
  city: string;
  format: string;
};

export const email = "office@sk-struktura.ru";

export const vacancies: Vacancy[] = [
  { number: "01", title: "Архитектор", city: "Москва", format: "Полная занятость" },
  { number: "02", title: "Дизайнер интерьера", city: "Москва", format: "Полная занятость" },
  { number: "03", title: "Сметчик", city: "Москва", format: "Полная занятость" },
  { number: "04", title: "Руководитель проектов", city: "Москва", format: "Полная занятость" },
];

export const offers = [
  "Работу в динамичной, технологически продвинутой компании",
  "Участие в создании архитектурных и инженерных решений с использованием современных технологий",
  "Возможности для непрерывного профессионального роста и развития",
  "Конкурентоспособную зарплату и привлекательные бонусы",
  "Современный офис и передовое рабочее пространство",
];

export const mailto = (role?: string) =>
  `mailto:${email}?subject=${encodeURIComponent(role ? `Отклик на вакансию: ${role}` : "Резюме в STRUKTURA")}`;
