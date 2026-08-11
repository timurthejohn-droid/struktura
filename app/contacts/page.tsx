import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ContactsHero from "../components/ContactsHero";
import ContactsInfo from "../components/ContactsInfo";
import ContactsMap from "../components/ContactsMap";
import ContactForm from "../components/ContactForm";

export const metadata: Metadata = {
  title: "Контакты — STRUKTURA+",
  description:
    "Свяжитесь с STRUKTURA+: адрес офиса, телефон, почта и форма заявки на проект.",
};

export default function ContactsPage() {
  return (
    <>
      <Nav />
      <main>
        <ContactsHero />
        <ContactsInfo />
        <ContactsMap />
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
