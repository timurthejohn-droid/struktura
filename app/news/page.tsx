import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ContactForm from "../components/ContactForm";
import NewsHero from "../components/news/NewsHero";
import NewsIndex from "../components/news/NewsIndex";

export const metadata = {
  title: "Новости и статьи — STRUKTURA",
  description:
    "Лента STRUKTURA: сданные объекты, собственные разработки и технические разборы инженерных решений.",
};

export default function NewsPage() {
  return (
    <>
      <Nav />
      <main>
        <NewsHero />
        <NewsIndex />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
