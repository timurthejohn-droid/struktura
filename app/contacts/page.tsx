import type { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import ContactsHero from "../components/ContactsHero";
import ContactsInfo from "../components/ContactsInfo";
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
        <ContactForm />
      </main>
      <Footer />
    </>
  );
}
