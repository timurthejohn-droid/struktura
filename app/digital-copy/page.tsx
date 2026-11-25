import type { Metadata } from "next";
import DigitalV2Page from "../components/digital/DigitalV2Page";

// Версия V2 с переключателем версий. Основная /digital показывает эту же страницу без него.
export const metadata: Metadata = {
  title: "Цифровая среда STRUKTURA+ · Цифровое ядро",
  description:
    "Цифровое ядро STRUKTURA: как мы развивали цифровую среду и как она связывает исходные данные, подсистему, производства, логистику и площадку на объекте.",
};

export default function DigitalCopyPage() {
  return <DigitalV2Page showVersions />;
}
