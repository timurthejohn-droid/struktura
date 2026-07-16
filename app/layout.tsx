import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STRUKTURA — Разработчик и интегратор уникальных архитектурных решений",
  description:
    "Превращаем сложные архитектурные идеи в реализованные объекты. Объединяем проектирование, производство и монтаж в единую систему.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body className="antialiased">{children}</body>
    </html>
  );
}
