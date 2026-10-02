"use client";

import { Component, useEffect, useLayoutEffect, useMemo, useRef, type ErrorInfo, type ReactNode } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Grid, Html, Lightformer } from "@react-three/drei";
import {
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  Color,
  EdgesGeometry,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  Matrix4,
  MeshStandardMaterial,
  PerspectiveCamera,
  Quaternion,
  Vector3,
} from "three";
import type { MotionValue } from "framer-motion";
import {
  DEPTH,
  GROUND_Y,
  HERO_INDEX,
  PANEL_T,
  buildPanels,
  buildSubsystem,
  zoneLabel,
  type PanelInfo,
} from "./facade";
import { DATA_CARDS, ROUTE_LEADS, STEP_KEYFRAMES, stepAt, type DataCardKey } from "./panelStoryData";
import { makePerforation } from "./textures";

export type SceneStats = { installed: number; total: number; route: number[] };
export type HoverInfo = {
  id: string;
  zone: string;
  size: string;
  place: string;
  status: string;
  x: number;
  y: number;
};

type SceneProps = {
  progress: MotionValue<number>;
  reduced: boolean;
  active: boolean;
  onStats?: (stats: SceneStats) => void;
  onHover?: (info: HoverInfo | null) => void;
};

const ORANGE = "#ff5a00";
const ASM_DURATION = 0.36;

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const mm = (m: number) => Math.round(m * 1000).toLocaleString("ru-RU");

/** Монтаж идёт зонами слева направо, внутри зоны — снизу вверх. */
const panelDelay = (pn: PanelInfo) => pn.zone * 0.08 + (pn.col % 2) * 0.015 + pn.row * 0.007;
const asmLocal = (asm: number, delay: number, lead = 0) => clamp01((asm - delay + lead) / ASM_DURATION);

type Side = "left" | "right" | "bottom";
type Anchor = { key: DataCardKey; pos: [number, number, number]; side: Side };

function cardAnchors(narrow: boolean): Anchor[] {
  if (narrow) {
    // две колонки у краёв панели: карточки не выходят за экран и не лезут под заголовок
    return [
      { key: "calc", pos: [-0.04, 0.7, 0.25], side: "left" },
      { key: "rd", pos: [0.04, 0.7, 0.25], side: "right" },
      { key: "mockup", pos: [-0.04, -0.6, 0.3], side: "left" },
      { key: "cam", pos: [0.04, -0.6, 0.3], side: "right" },
      { key: "ppr", pos: [-0.04, -1.06, 0.25], side: "left" },
      { key: "qr", pos: [0.04, -1.06, 0.25], side: "right" },
      { key: "pack", pos: [0, -1.52, 0.4], side: "bottom" },
    ];
  }
  const x = 0.66;
  const xm = 0.78;
  const y = 0.6;
  return [
    { key: "calc", pos: [-x, y, 0.25], side: "left" },
    { key: "rd", pos: [x, y + 0.02, 0.2], side: "right" },
    { key: "cam", pos: [xm, 0.02, 0.3], side: "right" },
    { key: "qr", pos: [x, -y, 0.2], side: "right" },
    { key: "pack", pos: [0, -0.8, 0.45], side: "bottom" },
    { key: "ppr", pos: [-x, -y, 0.25], side: "left" },
    { key: "mockup", pos: [-xm, 0, 0.35], side: "left" },
  ];
}

function CardIcon({ k }: { k: DataCardKey }) {
  const s = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "square" as const };
  switch (k) {
    case "calc":
      return (
        <svg viewBox="0 0 32 22" aria-hidden>
          <path d="M3 18h26" {...s} />
          <path d="M8 3v11M16 3v11M24 3v11M5.5 11.5 8 14l2.5-2.5M13.5 11.5 16 14l2.5-2.5M21.5 11.5 24 14l2.5-2.5" {...s} />
        </svg>
      );
    case "rd":
      return (
        <svg viewBox="0 0 32 22" aria-hidden>
          <rect x="3" y="2" width="26" height="18" {...s} />
          <path d="M7 6h12v9H7zM22 15h4M22 12h4M7 18h8" {...s} />
        </svg>
      );
    case "cam":
      return (
        <svg viewBox="0 0 32 22" aria-hidden>
          <path d="M3 4h24v3H5v3h22v3H5v3h22v3H3" {...s} />
        </svg>
      );
    case "qr":
      return (
        <svg viewBox="0 0 32 22" aria-hidden>
          <path d="M9 2h6v6H9zM20 2h6v6h-6zM9 14h6v6H9z" {...s} />
          <path d="M18 12h3v3h-3zM23 16h3v4h-3zM18 18h2v2h-2zM24 11h2v2h-2z" fill="currentColor" />
        </svg>
      );
    case "pack":
      return (
        <svg viewBox="0 0 32 22" aria-hidden>
          <path d="M4 7h24v13H4zM4 7l4-5h16l4 5M10 7v13M22 7v13" {...s} />
        </svg>
      );
    case "ppr":
      return (
        <svg viewBox="0 0 32 22" aria-hidden>
          <path d="M16 1v5M16 6l-7 5M16 6l7 5M9 11h14v10H9z" {...s} />
        </svg>
      );
    case "mockup":
      return (
        <svg viewBox="0 0 32 22" aria-hidden>
          <path d="M6 2h20v18H6z" {...s} />
          <path d="M11 11l4 4 7-8" {...s} />
        </svg>
      );
  }
}

const LABEL_PANELS = [9, 24, 58, 77, 96, 113];

function Story({ progress, reduced, onStats, onHover }: Omit<SceneProps, "active">) {
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const narrow = size.width < 640 || size.width / size.height < 0.9;

  const panels = useMemo(buildPanels, []);
  const others = useMemo(() => panels.filter((pn) => pn.index !== HERO_INDEX), [panels]);
  const delays = useMemo(() => others.map(panelDelay), [others]);
  const hero = panels[HERO_INDEX];
  const heroDelay = panelDelay(hero);
  const sub = useMemo(buildSubsystem, []);
  const anchors = useMemo(() => cardAnchors(narrow), [narrow]);
  const cardData = useMemo(() => new Map(DATA_CARDS.map((c) => [c.key, c])), []);

  const res = useMemo(() => {
    const tex = makePerforation();
    const box = new BoxGeometry(1, 1, 1);
    const line = (color: string) => new LineBasicMaterial({ color, transparent: true, opacity: 0, depthWrite: false });
    return {
      tex,
      box,
      edges: new EdgesGeometry(box),
      panel: new MeshStandardMaterial({ map: tex, metalness: 0.35, roughness: 0.42, transparent: true }),
      hero: new MeshStandardMaterial({
        map: tex,
        metalness: 0.35,
        roughness: 0.42,
        emissive: new Color(ORANGE),
        emissiveIntensity: 0,
      }),
      orange: new MeshStandardMaterial({
        color: ORANGE,
        metalness: 0.45,
        roughness: 0.45,
        emissive: new Color("#3a1200"),
        emissiveIntensity: 0.2,
      }),
      base: new MeshStandardMaterial({ color: "#2b2a28", roughness: 0.9, metalness: 0.05 }),
      heroEdge: line(ORANGE),
      link: line("#ffffff"),
      rod: line(ORANGE),
      dim: line("#ffffff"),
      cardLines: DATA_CARDS.map(() => line(ORANGE)),
    };
  }, []);

  // геометрия линий, которые пересчитываются каждый кадр
  const linkGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(others.length * 6), 3));
    return g;
  }, [others]);
  const rodGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(4 * 6), 3));
    return g;
  }, []);
  const dimGeo = useMemo(() => {
    const { w, h } = hero;
    const yb = -h / 2 - 0.1;
    const xr = w / 2 + 0.1;
    const t = 0.035;
    const pts = [
      [-w / 2, yb, 0.02, w / 2, yb, 0.02],
      [-w / 2, yb - t, 0.02, -w / 2, yb + t, 0.02],
      [w / 2, yb - t, 0.02, w / 2, yb + t, 0.02],
      [xr, -h / 2, 0.02, xr, h / 2, 0.02],
      [xr - t, -h / 2, 0.02, xr + t, -h / 2, 0.02],
      [xr - t, h / 2, 0.02, xr + t, h / 2, 0.02],
    ].flat();
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(new Float32Array(pts), 3));
    return g;
  }, [hero]);
  const cardGeos = useMemo(
    () =>
      anchors.map(({ pos: [x, y, z] }) => {
        const ex = Math.max(-hero.w / 2, Math.min(hero.w / 2, x));
        const ey = Math.max(-hero.h / 2, Math.min(hero.h / 2, y));
        const g = new BufferGeometry();
        g.setAttribute("position", new BufferAttribute(new Float32Array([ex, ey, 0.02, x, y, z]), 3));
        return g;
      }),
    [anchors, hero],
  );

  useEffect(
    () => () => {
      res.tex.dispose();
      res.box.dispose();
      res.edges.dispose();
      [res.panel, res.hero, res.orange, res.base, res.heroEdge, res.link, res.rod, res.dim, ...res.cardLines].forEach(
        (m) => m.dispose(),
      );
      linkGeo.dispose();
      rodGeo.dispose();
      dimGeo.dispose();
    },
    [res, linkGeo, rodGeo, dimGeo],
  );
  useEffect(() => () => cardGeos.forEach((g) => g.dispose()), [cardGeos]);

  const panelsRef = useRef<InstancedMesh>(null);
  const membersRef = useRef<InstancedMesh>(null);
  const baseRef = useRef<InstancedMesh>(null);
  const heroRef = useRef<Group>(null);
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const dimEls = useRef<(HTMLDivElement | null)[]>([]);
  const tagEl = useRef<HTMLDivElement>(null);
  const tagStatusEl = useRef<HTMLSpanElement>(null);
  const labelGroups = useRef<(Group | null)[]>([]);
  const labelEls = useRef<(HTMLDivElement | null)[]>([]);
  const labelSlots = useMemo(
    () => new Map(LABEL_PANELS.map((idx, j) => [others.findIndex((pn) => pn.index === idx), j])),
    [others],
  );

  useLayoutEffect(() => {
    const members = membersRef.current;
    const base = baseRef.current;
    if (members) {
      sub.members.forEach((m, i) => members.setMatrixAt(i, m));
      members.instanceMatrix.needsUpdate = true;
      members.computeBoundingSphere();
    }
    if (base) {
      sub.base.forEach((m, i) => base.setMatrixAt(i, m));
      base.instanceMatrix.needsUpdate = true;
      base.computeBoundingSphere();
    }
    const mesh = panelsRef.current;
    if (mesh) {
      const white = new Color("#ffffff");
      for (let i = 0; i < others.length; i++) mesh.setColorAt(i, white);
    }
  }, [sub, others]);

  const pRef = useRef(reduced ? STEP_KEYFRAMES[stepAt(progress.get())] : progress.get());
  const hoverRef = useRef(-1);
  const statsKey = useRef("");
  const tagKey = useRef("");
  const tmp = useMemo(
    () => ({
      m: new Matrix4(),
      q: new Quaternion(),
      q2: new Quaternion(),
      pos: new Vector3(),
      scale: new Vector3(),
      col: new Color(),
      white: new Color("#ffffff"),
      install: new Color("#ff6a1a"),
      hover: new Color(ORANGE),
      target: new Vector3(),
      t2: new Vector3(),
    }),
    [],
  );

  const heroAz = Math.atan2(hero.normal.x, hero.normal.z);
  const heroFocus = useMemo(() => hero.center.clone().addScaledVector(hero.normal, 0.55), [hero]);

  useFrame((state, dt) => {
    const raw = progress.get();
    const goal = reduced ? STEP_KEYFRAMES[stepAt(raw)] : raw;
    pRef.current += (goal - pRef.current) * (reduced ? 1 : 1 - Math.exp(-Math.min(dt, 0.1) * 5));
    const p = pRef.current;

    // ── фазы сценария ──
    const highlight = smooth(0.03, 0.09, p);
    const dolly = smooth(0.14, 0.32, p);
    const ghost = smooth(0.16, 0.28, p) * (1 - smooth(0.57, 0.68, p));
    const slide = smooth(0.19, 0.33, p);
    const dims = smooth(0.24, 0.31, p) * (1 - smooth(0.36, 0.41, p));
    const orbit = smooth(0.36, 0.56, p);
    const pull = smooth(0.57, 0.76, p);
    const explode = smooth(0.58, 0.74, p);
    const links = smooth(0.64, 0.74, p) * (1 - smooth(0.8, 0.86, p));
    const back = smooth(0.8, 1, p);
    const assembling = p > 0.8;
    const asm = clamp01((p - 0.8) / 0.17);

    // ── камера: общий план → P-042 → облёт → отъезд → исходный ракурс ──
    const aspect = size.width / size.height;
    const vt = Math.tan((camera.fov * Math.PI) / 360);
    const wide = Math.max(10.4 / 2 / vt, (narrow ? 8 : 19) / 2 / (vt * aspect));
    const close1 = narrow ? 5.4 : 3.7;
    const close2 = narrow ? 9 : 5;

    tmp.target.set(0, 0.15, -0.5);
    let az = -0.3;
    let el = 0.07;
    let d = wide;
    const mix = (tx: Vector3, a: number, e: number, dist: number, k: number) => {
      tmp.target.lerp(tx, k);
      az += (a - az) * k;
      el += (e - el) * k;
      d += (dist - d) * k;
    };
    mix(heroFocus, heroAz + 0.38, 0.14, close1, dolly);
    mix(heroFocus, heroAz + 0.1, 0.05, close2, orbit);
    mix(tmp.t2.set(0, 0.3, 0.8), 0.6, 0.2, wide * 1.3, pull);
    mix(tmp.t2.set(0, 0.15, -0.5), -0.3, 0.07, wide, back);
    if (!reduced) az += Math.sin(state.clock.elapsedTime * 0.2) * 0.012;

    camera.position.set(
      tmp.target.x + Math.sin(az) * Math.cos(el) * d,
      tmp.target.y + Math.sin(el) * d,
      tmp.target.z + Math.cos(az) * Math.cos(el) * d,
    );
    camera.lookAt(tmp.target);
    // композиция: на десктопе объект справа от подписи, на мобильном — над ней
    if (narrow) camera.setViewOffset(size.width, size.height, 0, size.height * 0.15, size.width, size.height);
    else camera.setViewOffset(size.width, size.height, -size.width * 0.18, 0, size.width, size.height);

    // ── панели ──
    const mesh = panelsRef.current;
    const linkPos = linkGeo.attributes.position as BufferAttribute;
    let installed = 0;
    if (mesh) {
      for (let i = 0; i < others.length; i++) {
        const pn = others[i];
        const raw = asmLocal(asm, delays[i]);
        if (assembling && raw >= 1) installed++;
        const local = easeInOut(raw);
        const e = explode * (1 - local);

        tmp.pos.copy(pn.center).addScaledVector(pn.scatter, e);
        if (assembling) tmp.pos.y += Math.sin(local * Math.PI) * 0.45;
        tmp.q2.copy(pn.quat).multiply(pn.spin);
        tmp.q.copy(pn.quat).slerp(tmp.q2, e);
        tmp.scale.set(pn.w, pn.h, PANEL_T);
        tmp.m.compose(tmp.pos, tmp.q, tmp.scale);
        mesh.setMatrixAt(i, tmp.m);

        linkPos.setXYZ(i * 2, tmp.pos.x, tmp.pos.y, tmp.pos.z);
        linkPos.setXYZ(
          i * 2 + 1,
          pn.center.x + pn.normal.x * DEPTH.rail,
          pn.center.y + pn.normal.y * DEPTH.rail,
          pn.center.z + pn.normal.z * DEPTH.rail,
        );

        const slot = labelSlots.get(i);
        if (slot !== undefined) labelGroups.current[slot]?.position.copy(tmp.pos).addScaledVector(pn.normal, 0.05);

        const pulse = assembling ? Math.sin(local * Math.PI) : 0;
        tmp.col.copy(tmp.white).lerp(tmp.install, pulse * 0.55);
        if (hoverRef.current === i) tmp.col.copy(tmp.hover);
        mesh.setColorAt(i, tmp.col);
      }
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      mesh.boundingSphere = null; // панели двигаются — сфера для рейкаста пересчитается по запросу
      linkPos.needsUpdate = true;
    }
    res.panel.opacity = 1 - ghost * 0.88;
    res.panel.depthWrite = ghost < 0.05;
    res.link.opacity = links * 0.32;

    // ── P-042 ──
    const heroRaw = asmLocal(asm, heroDelay);
    if (assembling && heroRaw >= 1) installed++;
    const heroLocal = easeInOut(heroRaw);
    const out = (1.1 * slide + (1.9 - 1.1 * slide) * explode) * (1 - heroLocal);
    const g = heroRef.current;
    if (g) {
      g.position.copy(hero.center).addScaledVector(hero.normal, out);
      if (assembling) g.position.y += Math.sin(heroLocal * Math.PI) * 0.45;
      g.quaternion.copy(hero.quat);
    }
    res.heroEdge.opacity = highlight;
    res.hero.emissiveIntensity = highlight * 0.1 + (assembling ? Math.sin(heroLocal * Math.PI) * 0.35 : 0);

    // тяги от кронштейнов P-042 к ригелям
    const rodPos = rodGeo.attributes.position as BufferAttribute;
    let r = 0;
    for (const sx of [-1, 1]) {
      for (const sy of [-1, 1]) {
        const cx = sx * hero.w * 0.32;
        rodPos.setXYZ(r++, cx, sy * hero.h * 0.38, -0.04);
        rodPos.setXYZ(r++, cx, sy * (hero.h / 2 + 0.022), DEPTH.rail - out);
      }
    }
    rodPos.needsUpdate = true;
    res.rod.opacity = slide * (1 - pull) * 0.9;
    res.dim.opacity = dims * 0.7;

    dimEls.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = String(dims);
      el.style.visibility = dims > 0.01 ? "visible" : "hidden";
    });

    // карточки данных
    anchors.forEach((_, i) => {
      const o = smooth(0.37 + i * 0.02, 0.44 + i * 0.02, p) * (1 - smooth(0.56, 0.61, p));
      res.cardLines[i].opacity = o * 0.85;
      const el = cardEls.current[i];
      if (!el) return;
      el.style.opacity = String(o);
      el.style.visibility = o > 0.01 ? "visible" : "hidden";
      el.style.setProperty("--ps-in", String(1 - o));
    });

    labelEls.current.forEach((el) => {
      if (!el) return;
      el.style.opacity = String(links);
      el.style.visibility = links > 0.01 ? "visible" : "hidden";
    });

    // бейдж P-042: ID один на всём пути, меняется только статус
    if (tagEl.current) {
      tagEl.current.style.opacity = String(highlight);
      tagEl.current.style.visibility = highlight > 0.01 ? "visible" : "hidden";
    }
    const status =
      p < 0.14
        ? `ось ${hero.col + 1} · ряд ${hero.row + 1}`
        : p < 0.36
          ? "ред. A · проект"
          : p < 0.57
            ? "7 связанных пакетов"
            : !assembling
              ? `зона ${zoneLabel(hero.zone)}`
              : heroRaw >= 1
                ? "установлена · обмер ✓"
                : heroRaw > 0
                  ? `монтаж · ${zoneLabel(hero.zone)}`
                  : `в пути · ${zoneLabel(hero.zone)}`;
    if (status !== tagKey.current && tagStatusEl.current) {
      tagKey.current = status;
      tagStatusEl.current.textContent = status;
    }

    if (hoverRef.current >= 0 && p < 0.57) {
      hoverRef.current = -1;
      gl.domElement.style.cursor = "";
      onHover?.(null);
    }

    // счётчики маршрута для HUD
    if (onStats) {
      const total = panels.length;
      const route = ROUTE_LEADS.map((lead) => {
        if (!assembling) return 0;
        let n = asmLocal(asm, heroDelay, lead) >= 1 ? 1 : 0;
        for (let i = 0; i < delays.length; i++) if (asmLocal(asm, delays[i], lead) >= 1) n++;
        return n;
      });
      const key = `${installed}|${route.join(",")}`;
      if (key !== statsKey.current) {
        statsKey.current = key;
        onStats({ installed, total, route });
      }
    }
  });

  const describe = (pn: PanelInfo, e: ThreeEvent<PointerEvent>) => {
    const p = pRef.current;
    const raw = asmLocal(clamp01((p - 0.8) / 0.17), panelDelay(pn));
    const status = p > 0.8 && raw >= 1 ? "Установлена" : p > 0.8 && raw > 0 ? "В монтаже" : "В модели · ред. A";
    return {
      id: pn.id,
      zone: zoneLabel(pn.zone),
      size: `${mm(pn.w)} × ${mm(pn.h)} мм`,
      place: `ось ${pn.col + 1} · ряд ${pn.row + 1}`,
      status,
      x: e.nativeEvent.clientX,
      y: e.nativeEvent.clientY,
    };
  };

  const onPanelMove = (e: ThreeEvent<PointerEvent>) => {
    if (pRef.current < 0.57 || e.instanceId === undefined) return;
    e.stopPropagation();
    hoverRef.current = e.instanceId;
    gl.domElement.style.cursor = "pointer";
    onHover?.(describe(others[e.instanceId], e));
  };
  const onHeroMove = (e: ThreeEvent<PointerEvent>) => {
    if (pRef.current < 0.05) return;
    e.stopPropagation();
    hoverRef.current = -1;
    gl.domElement.style.cursor = "pointer";
    onHover?.(describe(hero, e));
  };
  const onLeave = () => {
    hoverRef.current = -1;
    gl.domElement.style.cursor = "";
    onHover?.(null);
  };

  const htmlProps = { zIndexRange: [6, 0] as [number, number], style: { pointerEvents: "none" as const } };

  return (
    <>
      <instancedMesh
        ref={panelsRef}
        args={[res.box, res.panel, others.length]}
        frustumCulled={false}
        onPointerMove={onPanelMove}
        onPointerDown={onPanelMove}
        onPointerOut={onLeave}
      />
      <instancedMesh ref={membersRef} args={[res.box, res.orange, sub.members.length]} />
      <instancedMesh ref={baseRef} args={[res.box, res.base, sub.base.length]} />
      <lineSegments geometry={linkGeo} material={res.link} frustumCulled={false} />

      <group ref={heroRef}>
        <mesh
          geometry={res.box}
          material={res.hero}
          scale={[hero.w, hero.h, PANEL_T]}
          onPointerMove={onHeroMove}
          onPointerDown={onHeroMove}
          onPointerOut={onLeave}
        >
          <lineSegments geometry={res.edges} material={res.heroEdge} />
        </mesh>
        {[-1, 1].flatMap((sx) =>
          [-1, 1].map((sy) => (
            <mesh
              key={`${sx}${sy}`}
              geometry={res.box}
              material={res.orange}
              position={[sx * hero.w * 0.32, sy * hero.h * 0.38, -0.045]}
              scale={[0.12, 0.05, 0.04]}
            />
          )),
        )}
        <lineSegments geometry={rodGeo} material={res.rod} frustumCulled={false} />
        <lineSegments geometry={dimGeo} material={res.dim} />

        <Html position={[0, -hero.h / 2 - 0.1, 0.02]} {...htmlProps}>
          <div ref={(el) => void (dimEls.current[0] = el)} className="ps-dim ps-dim--bottom">
            {mm(hero.w)}
          </div>
        </Html>
        <Html position={[hero.w / 2 + 0.1, 0, 0.02]} {...htmlProps}>
          <div ref={(el) => void (dimEls.current[1] = el)} className="ps-dim ps-dim--side">
            {mm(hero.h)}
          </div>
        </Html>
        <Html position={[-hero.w / 2, hero.h / 2 + 0.03, 0.03]} {...htmlProps}>
          <div ref={tagEl} className="ps-idtag">
            <b>{hero.id}</b>
            <span ref={tagStatusEl} />
          </div>
        </Html>

        {anchors.map((a, i) => {
          const card = cardData.get(a.key)!;
          return (
            <group key={a.key}>
              <lineSegments geometry={cardGeos[i]} material={res.cardLines[i]} />
              <Html position={a.pos} {...htmlProps}>
                <div ref={(el) => void (cardEls.current[i] = el)} className={`ps-card ps-card--${a.side}`}>
                  <span className="ps-card-icon">
                    <CardIcon k={a.key} />
                  </span>
                  <span className="ps-card-tag">{card.tag}</span>
                  <span className="ps-card-line">{card.line}</span>
                </div>
              </Html>
            </group>
          );
        })}
      </group>

      {LABEL_PANELS.map((idx, j) => (
        <group key={idx} ref={(el) => void (labelGroups.current[j] = el)}>
          <Html {...htmlProps}>
            <div ref={(el) => void (labelEls.current[j] = el)} className="ps-idmini">
              {panels[idx].id}
            </div>
          </Html>
        </group>
      ))}
    </>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Panel story scene failed", error, info);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function PanelStoryScene({ active, ...props }: SceneProps) {
  return (
    <SceneBoundary>
      <Canvas
        frameloop={active ? "always" : "never"}
        dpr={[1, 1.75]}
        camera={{ fov: 34, near: 0.1, far: 140, position: [0, 0, 18] }}
        gl={{ antialias: true, alpha: true }}
        style={{ touchAction: "pan-y" }}
      >
        <fog attach="fog" args={["#101010", 22, 60]} />
        <ambientLight intensity={0.45} />
        <hemisphereLight args={["#ffffff", "#161616", 0.35]} />
        <directionalLight position={[6, 9, 12]} intensity={1.7} />
        <directionalLight position={[-8, 3, -6]} intensity={0.6} color="#ff8a4c" />
        <Environment resolution={128}>
          <Lightformer form="rect" position={[0, 6, 9]} scale={[14, 5, 1]} intensity={2} />
          <Lightformer form="rect" position={[-9, 2, 3]} scale={[4, 10, 1]} intensity={1} />
          <Lightformer form="rect" position={[8, 1, -3]} scale={[3, 8, 1]} intensity={1.2} color="#ff7a33" />
        </Environment>

        <Story {...props} />

        <Grid
          position={[0, GROUND_Y, 0]}
          args={[80, 80]}
          cellSize={0.5}
          cellThickness={0.6}
          cellColor="#242424"
          sectionSize={3}
          sectionThickness={1}
          sectionColor="#3a3a3a"
          fadeDistance={48}
          fadeStrength={1.6}
          infiniteGrid
        />
      </Canvas>
    </SceneBoundary>
  );
}
