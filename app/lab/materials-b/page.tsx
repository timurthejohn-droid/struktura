import type { Metadata } from "next";
import { readFileSync } from "fs";
import path from "path";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import MaterialsHero from "../../components/materials/MaterialsHero";
import MaterialsNavigator from "../../components/materials/MaterialsNavigator";
import LabBar from "../../components/materials/LabBar";
import {
  FAMILIES as DEFAULT_FAMILIES,
  MATERIALS as DEFAULT_MATERIALS,
  Capability,
  Family,
  FamilyId,
  Material,
  MaterialContent,
} from "../../components/materials/materialsData";

export const metadata: Metadata = {
  title: "ЛАБ · Вариант B — два каталога подряд | STRUKTURA",
  robots: { index: false, follow: false },
};

type CustomerMaterial = {
  family: string;
  name: string;
  promise?: string;
  can?: string[];
  caps?: { num: string; label: string }[];
  risks?: string;
  format?: string;
  weight?: string;
  zone?: string;
  fire?: string;
  plast?: string;
  proch?: string;
  obr?: string;
  fin?: string;
  src?: string;
  proven?: boolean;
  base?: string;
  uv?: string;
  extraRows?: { k: string; v: string }[];
};

type CustomerMaterialsData = {
  materials: CustomerMaterial[];
  caps: Record<string, string>;
};

const FAMILY_BY_CUSTOMER_NAME: Record<string, FamilyId> = {
  "Покрытия и технологии": "coatings",
  "Металлы": "metal",
  "Стекло": "glass",
  "Дерево": "wood",
  "Минеральные": "mineral",
  "Акустика": "acoustic",
  "Сложные материалы": "complex",
};

const FAMILY_META: Record<FamilyId, Family> = {
  coatings: {
    id: "coatings",
    n: "01",
    name: "Покрытия и технологии",
    desc: "Финиши, покрытия и поверхностные технологии как самостоятельный архитектурный инструмент.",
    grad: "linear-gradient(135deg,#d8d7d2 0%,#6f6f78 55%,#ece9df 100%)",
  },
  ...Object.fromEntries(DEFAULT_FAMILIES.map((family, index) => [family.id, { ...family, n: String(index + 2).padStart(2, "0") }])) as Record<Exclude<FamilyId, "coatings">, Family>,
};

const CAP_SLUG_BY_NUM: Record<string, string> = {
  "01": "forma",
  "02": "masshtab",
  "03": "kinetika",
  "04": "svet",
  "05": "soedineniya",
  "07": "legkost",
  "08": "poverhnost",
  "09": "additive",
};

function readCustomerMaterials(): CustomerMaterialsData {
  const file = path.join(process.cwd(), "component3_updated_v2 (1).html");
  const html = readFileSync(file, "utf8");
  const match = html.match(/const MTR = (\{[\s\S]*?\});\s*const FAM_ACCENT/);

  if (!match) {
    throw new Error("Не удалось найти const MTR в component3_updated_v2 (1).html");
  }

  return JSON.parse(match[1]) as CustomerMaterialsData;
}

function materialGrad(name: string, family: FamilyId) {
  return DEFAULT_MATERIALS.find((material) => material.name === name)?.grad ?? FAMILY_META[family].grad;
}

function materialSub(material: CustomerMaterial) {
  if (material.fin) return material.fin;
  const caps = material.caps?.map((cap) => cap.label).join(" · ");
  return caps || material.family;
}

function materialStatuses(material: CustomerMaterial) {
  const rows = [material.proven ? "доказано" : "в разработке", material.base ?? "", material.uv ?? ""];
  return rows.filter(Boolean);
}

function materialWatch(material: CustomerMaterial) {
  return [
    material.risks,
    material.plast ? `Пластичность: ${material.plast}.` : "",
    material.proch ? `Прочность: ${material.proch}.` : "",
    material.obr ? `Обработка: ${material.obr}.` : "",
    material.fin ? `Отделка: ${material.fin}.` : "",
    ...(material.extraRows?.map((row) => `${row.k}: ${row.v}.`) ?? []),
  ]
    .filter(Boolean)
    .join(" ");
}

function toExplorerData(data: CustomerMaterialsData): {
  capabilities: Capability[];
  families: Family[];
  materials: Material[];
  content: Record<string, MaterialContent>;
} {
  const familyIds = Array.from(
    new Set(data.materials.map((material) => FAMILY_BY_CUSTOMER_NAME[material.family]).filter((id): id is FamilyId => Boolean(id)))
  );

  const families = familyIds.map((id, index) => ({ ...FAMILY_META[id], n: String(index + 1).padStart(2, "0") }));

  const materials = data.materials
    .map((material): Material | null => {
      const family = FAMILY_BY_CUSTOMER_NAME[material.family];
      if (!family) return null;

      return {
        family,
        name: material.name,
        sub: materialSub(material),
        can: material.can ?? [],
        edge: material.promise ?? "",
        statuses: materialStatuses(material),
        watch: materialWatch(material),
        fmt: material.format ?? "",
        weight: material.weight ?? "",
        zone: material.zone ?? "",
        fire: material.fire ?? "",
        grad: materialGrad(material.name, family),
      };
    })
    .filter((material): material is Material => Boolean(material));

  const capabilities = Object.entries(data.caps)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([num, label], index) => {
      const slug = CAP_SLUG_BY_NUM[num] ?? `cap-${num}`;
      return {
        slug,
        n: String(index + 1).padStart(2, "0"),
        title: label,
        tags: `${num} ${label}`,
        desc: "",
        materials: data.materials.filter((material) => material.caps?.some((cap) => cap.num === num)).map((material) => material.name),
      };
    });

  const content = Object.fromEntries(
    data.materials
      .filter((material) => material.src)
      .map((material) => [
        material.name,
        {
          articles: [
            {
              title: "источник характеристик",
              meta: "",
              desc: material.src ?? "",
            },
          ],
        },
      ])
  ) as Record<string, MaterialContent>;

  return { capabilities, families, materials, content };
}

export default function LabMaterialsB() {
  const materialsData = toExplorerData(readCustomerMaterials());

  return (
    <>
      <Nav />
      <LabBar
        variant="B"
        title="Два каталога подряд"
        desc="Текущий каталог возможностей остаётся без изменений. Ниже — второй каталог: сначала материал, затем радар его возможностей с проектами, статьями и мировыми кейсами."
        others={[
          { href: "/lab/materials-d", label: "Вариант D →" },
          { href: "/lab/materials-c", label: "Вариант C →" },
          { href: "/lab/materials-a", label: "Вариант A →" },
        ]}
      />
      <main>
        <MaterialsHero />

        {/* [02] Существующий каталог возможностей с данными из файла заказчика */}
        <MaterialsNavigator {...materialsData} />
      </main>
      <Footer />
    </>
  );
}
