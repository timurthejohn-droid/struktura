import type { Metadata } from "next";
import { AboutEditorialPage } from "../lab/about/page";

export const metadata: Metadata = {
  title: "О компании — STRUKTURA+",
  description:
    "STRUKTURA объединяет архитектурную идею, инженерную разработку, цифровое проектирование, производство, логистику и монтаж в одну управляемую систему.",
};

export default function AboutPage() {
  return <AboutEditorialPage showProof />;
}
