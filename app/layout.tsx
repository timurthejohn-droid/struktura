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
      <head>
        <script
          // Автолечение устаревшего кэша GitHub Pages: если JS-чанк не загрузился
          // (старый HTML ссылается на удалённые файлы) — одна перезагрузка за свежей
          // версией. Плюс страховка: контент никогда не остаётся скрытым прелоадером.
          dangerouslySetInnerHTML={{
            __html: `(function(){
setTimeout(function(){document.documentElement.classList.remove('preloading')},7000);
window.addEventListener('error',function(e){
  var t=e.target;
  if(t&&t.tagName==='SCRIPT'&&t.src){
    try{
      if(!sessionStorage.getItem('stk-reloaded')){
        sessionStorage.setItem('stk-reloaded','1');
        location.reload();
      }
    }catch(err){}
  }
},true);
window.addEventListener('load',function(){
  try{sessionStorage.removeItem('stk-reloaded')}catch(err){}
});
})();`,
          }}
        />
      </head>
      <body className="antialiased">
        <Preloader />
        {children}
      </body>
    </html>
  );
}
