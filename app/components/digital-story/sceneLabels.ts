// Подписи внутри 3D-схемы цифрового ядра (карточки участников, метки, выноски, финал).
// Те же стили, что в CoreStory, — чтобы схема выглядела одинаково на обеих страницах.
export const CORE_SCENE_LABELS_CSS = `
        /* ── подписи внутри 3D-сцены ── */
        .cs-st {
          display: grid;
          grid-template-columns: auto 1fr;
          column-gap: 7px;
          row-gap: 2px;
          align-items: center;
          transform: translate(-50%, -100%);
          padding: 6px 9px 7px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-top: 2px solid var(--c);
          background: rgba(14, 14, 14, 0.82);
          backdrop-filter: blur(6px);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: border-color 0.25s ease, box-shadow 0.25s ease;
        }
        .cs-st i {
          width: 6px;
          height: 6px;
          background: var(--c);
        }
        .cs-st b {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
        }
        .cs-st span {
          grid-column: 2;
          font-family: "Onest", sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
        }
        .cs-st[data-on="1"] {
          border-color: var(--c);
          box-shadow: 0 0 0 1px var(--c), 0 0 24px -4px var(--c);
        }
        .cs-tag {
          transform: translate(-50%, -50%);
          padding: 3px 6px 2px;
          background: var(--orange);
          color: #fff;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
        }
        .cs-tag--move {
          transform: translate(-50%, -100%);
        }
        .cs-note {
          position: relative;
          transform: translate(14px, -50%);
          padding: 4px 8px 3px;
          border-left: 2px solid var(--orange);
          background: rgba(14, 14, 14, 0.82);
          color: #ffd9c4;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .cs-note::before {
          content: "";
          position: absolute;
          right: 100%;
          top: 50%;
          width: 12px;
          height: 1px;
          margin-right: 2px;
          background: var(--orange);
        }
        .cs-dir {
          display: grid;
          gap: 2px;
          transform: translate(-50%, -100%);
          padding: 5px 9px 6px;
          border: 1px solid rgba(255, 255, 255, 0.14);
          border-top: 2px solid var(--orange);
          background: rgba(14, 14, 14, 0.82);
          backdrop-filter: blur(6px);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
        }
        .cs-dir b {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10.5px;
          font-weight: 400;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #fff;
        }
        .cs-dir span {
          font-family: "Onest", sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.55);
        }
        .cs-note--scan {
          border-left-color: #6cc4ea;
          color: #d2efff;
        }
        .cs-note--scan::before {
          display: none;
        }
        .cs-note--fact {
          border-left-color: #40cfae;
          color: #c9f5ea;
          transform: translate(-50%, -50%);
        }
        .cs-note--fact::before {
          display: none;
        }
        .cs-env {
          transform: translate(-50%, 0);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 9.5px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.55);
        }
        .cs-mark {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          opacity: 0;
          visibility: hidden;
          white-space: nowrap;
          text-align: center;
        }
        .cs-mark b {
          font-family: "CoFo Sans Mono", monospace;
          font-weight: 500;
          font-size: clamp(28px, 3.4vw, 52px);
          letter-spacing: 0.2em;
          color: var(--coal);
        }
        .cs-mark i {
          font-size: 0.6em;
          vertical-align: super;
          letter-spacing: 0;
        }
        .cs-mark span {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: rgba(24, 24, 24, 0.6);
        }

        .cs-callout {
          display: flex;
          gap: 10px;
          align-items: center;
          transform: translate(22px, -50%);
          padding: 8px 10px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-left: 2px solid #fff;
          background: rgba(14, 14, 14, 0.86);
          backdrop-filter: blur(6px);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
        }
        .cs-callout svg {
          width: 64px;
          height: 40px;
          flex-shrink: 0;
          fill: none;
          stroke: #ffd2b8;
          stroke-width: 1.4;
        }
        .cs-callout svg circle {
          fill: var(--orange);
          stroke: none;
        }
        .cs-callout svg .dim {
          stroke: rgba(255, 255, 255, 0.4);
          stroke-width: 1;
        }
        .cs-callout span {
          display: grid;
          gap: 3px;
          font-family: "Onest", sans-serif;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
        }
        .cs-callout b {
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          font-weight: 400;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
        }
        .cs-step {
          display: grid;
          place-items: center;
          width: 20px;
          height: 20px;
          border: 1px solid var(--orange);
          background: rgba(14, 14, 14, 0.85);
          color: #fff;
          font-family: "CoFo Sans Mono", monospace;
          font-size: 11px;
          opacity: 0;
          visibility: hidden;
          transform: translate(14px, -14px);
        }
        .cs-pop {
          padding: 3px 7px 2px;
          border-left: 2px solid var(--c);
          background: rgba(14, 14, 14, 0.8);
          color: var(--c);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transform: translateY(-50%);
          font-family: "CoFo Sans Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        @media (max-width: 767px) {
          .cs-st {
            padding: 4px 6px 5px;
          }
          .cs-st b {
            font-size: 8.5px;
            letter-spacing: 0.04em;
          }
          .cs-st span,
          .cs-note,
          .cs-dir,
          .cs-callout span,
          .cs-pop {
            display: none;
          }
          .cs-mark b {
            font-size: 22px;
            letter-spacing: 0.12em;
          }
          .cs-mark span {
            font-size: 9px;
          }
        }
`;
