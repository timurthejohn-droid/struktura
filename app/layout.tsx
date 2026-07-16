import type { Metadata } from "next";
import "./globals.css";
import Preloader from "./components/Preloader";

export const metadata: Metadata = {
  title: "STRUKTURA — Разработчик и интегратор уникальных архитектурных решений",
  description:
    "Превращаем сложные архитектурные идеи в реализованные объекты. Объединяем проектирование, производство и монтаж в единую систему.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // .preloading держит rise-in элементов на паузе, пока играет прелоадер
    <html lang="ru" className="preloading" suppressHydrationWarning>
      <body className="antialiased">
        <Preloader />
        {children}
      </body>
    </html>
  );
}
