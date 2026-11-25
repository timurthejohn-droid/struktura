import type { Metadata } from "next";
import DigitalV2Page from "../components/digital/DigitalV2Page";

// Основная страница «Цифровая среда» — версия V2. Старые версии остаются
// по своим адресам: /digital-v1 (V1), /digital-copy (V2 с переключателем), /digital-story (V3).
export const metadata: Metadata = {
  title: "Цифровая среда STRUKTURA+ · Цифровое ядро",
  description:
    "Цифровое ядро STRUKTURA: как мы развивали цифровую среду и как она связывает исходные данные, подсистему, производства, логистику и площадку на объекте.",
};

export default function DigitalPage() {
  return <DigitalV2Page />;
}
