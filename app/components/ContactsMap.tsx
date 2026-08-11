import SectionHead from "./SectionHead";

// Карта офиса собственной сборки: тайлы лежат в public/map (см.
// scripts/fetch-map-tiles.mjs), поэтому никакого чужого интерфейса —
// ни кнопок зума, ни плашек, ни внешних запросов. Только план города,
// приглушённый под палитру, и фирменная метка.

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const address = "125040 Москва, Ленинградский проспект, д. 15 стр. 14, 4 этаж";
const query = encodeURIComponent("Москва, Ленинградский проспект, 15 стр. 14");
const mapLink = `https://yandex.ru/maps/?text=${query}&z=17`;

// Параметры сетки тайлов — выдаёт scripts/fetch-map-tiles.mjs
const ZOOM = 17;
const COLS = 7;
const ROWS = 3;
const TILE = 256;
const START_X = 79212;
const START_Y = 40955;
const MARKER_X = 881; // позиция офиса внутри сетки, px
const MARKER_Y = 507;

const tiles = Array.from({ length: COLS * ROWS }, (_, i) => ({
  col: i % COLS,
  row: Math.floor(i / COLS),
}));

const corners = [
  "left-[-1px] top-[-1px] border-l-2 border-t-2",
  "right-[-1px] top-[-1px] border-r-2 border-t-2",
  "left-[-1px] bottom-[-1px] border-b-2 border-l-2",
  "right-[-1px] bottom-[-1px] border-b-2 border-r-2",
];

export default function ContactsMap() {
  return (
    <section id="map" className="scroll-mt-24 bg-paper pb-16 md:pb-24">
      <div className="container-x">
        <SectionHead index="02" kicker="Офис на карте" theme="light" />

        <div className="relative overflow-hidden border border-black/10 bg-paper">
          <div className="relative h-[340px] overflow-hidden md:h-[480px]">
            {/* Слой тайлов: сетку сдвигаем так, чтобы офис оказался в центре кадра */}
            <div
              className="absolute left-1/2 top-1/2"
              style={{
                width: COLS * TILE,
                height: ROWS * TILE,
                marginLeft: -MARKER_X,
                marginTop: -MARKER_Y,
                filter: "grayscale(1) brightness(1.06) contrast(0.92)",
              }}
              aria-hidden
            >
              {tiles.map(({ col, row }) => (
                <img
                  key={`${col}-${row}`}
                  src={`${basePath}/map/${ZOOM}-${START_X + col}-${START_Y + row}.png`}
                  alt=""
                  width={TILE}
                  height={TILE}
                  loading="lazy"
                  draggable={false}
                  className="absolute select-none"
                  style={{ left: col * TILE, top: row * TILE }}
                />
              ))}
            </div>

            {/* Тёплый тон бумаги поверх серого плана */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{ background: "var(--paper)", mixBlendMode: "multiply", opacity: 0.45 }}
            />

            {/* Чертёжные оси через точку офиса */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <span className="absolute left-0 right-0 top-1/2 h-px bg-orange/25" />
              <span className="absolute bottom-0 left-1/2 top-0 w-px bg-orange/25" />
            </div>

            {/* Метка офиса */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <span className="block h-[54px] w-[54px] rounded-full border border-orange/45" />
              <span className="absolute left-1/2 top-1/2 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-orange" />
              <span className="absolute left-[calc(50%+38px)] top-1/2 -translate-y-1/2 whitespace-nowrap bg-ink px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white">
                STRUKTURA
                <span className="text-orange">+</span>
              </span>
            </div>

            {/* Обязательная атрибуция источника карты */}
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-3 right-7 font-mono text-[9px] uppercase tracking-[0.12em] text-ink/35 transition-colors hover:text-ink/60"
            >
              © OpenStreetMap
            </a>
          </div>

          {corners.map((corner) => (
            <span
              key={corner}
              aria-hidden
              className={`pointer-events-none absolute z-20 h-4 w-4 border-orange ${corner}`}
            />
          ))}

          {/* Карточка адреса: на мобильных — под картой, с md — поверх неё */}
          <div className="border-t border-black/10 bg-white p-6 md:absolute md:left-7 md:top-7 md:z-10 md:w-[330px] md:border md:border-black/10 md:p-7 md:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
            <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">Адрес офиса</span>
            <p className="mt-4 font-body text-[17px] leading-[1.45] text-ink md:text-[18px]">
              125040 Москва,
              <br />
              Ленинградский проспект,
              <br />
              д.&nbsp;15 стр.&nbsp;14, 4&nbsp;этаж
            </p>

            <div className="mt-6 border-t border-black/10 pt-5">
              <a
                href={mapLink}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.16em] text-orange transition-colors hover:text-ink"
              >
                Открыть в Яндекс.Картах
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </div>
        </div>

        <p className="sr-only">{address}</p>
      </div>
    </section>
  );
}
