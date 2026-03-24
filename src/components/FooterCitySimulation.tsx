"use client";

import { useEffect, useRef } from "react";

type Rgb = { r: number; g: number; b: number };
type Palette = {
  bg: string;
  sky: string;
  buildingA: string;
  buildingB: string;
  window: string;
  road: string;
  sidewalk: string;
  peopleA: string;
  peopleB: string;
  border: string;
};

function hexToRgb(hex: string): Rgb | null {
  const value = hex.trim();
  const m = value.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  if (!m) return null;
  const raw = m[1];
  if (raw.length === 3) {
    const r = parseInt(raw[0] + raw[0], 16);
    const g = parseInt(raw[1] + raw[1], 16);
    const b = parseInt(raw[2] + raw[2], 16);
    return { r, g, b };
  }
  const r = parseInt(raw.slice(0, 2), 16);
  const g = parseInt(raw.slice(2, 4), 16);
  const b = parseInt(raw.slice(4, 6), 16);
  return { r, g, b };
}

function getCssVar(varName: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const raw = window.getComputedStyle(document.documentElement).getPropertyValue(varName);
  return raw?.trim() ? raw.trim() : fallback;
}

function formatRgba({ r, g, b }: Rgb, alpha: number): string {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function makeRng(seed: number) {
  // Simple xorshift RNG for deterministic pixel layout (cheap + stable).
  let s = seed | 0;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1_000_000) / 1_000_000;
  };
}

type Building = {
  x: number;
  y: number;
  w: number;
  h: number;
  variant: 0 | 1;
  windows: Array<{ x: number; y: number; on: boolean }>;
};

type Ped = {
  id: number;
  x: number;
  laneY: number;
  speed: number;
  phase: number;
};

type Car = {
  id: number;
  x: number;
  laneY: number;
  speed: number;
  dir: 1 | -1;
  bodyW: number;
  color: string;
};

export function FooterCitySimulation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
    const prefersLight = window.matchMedia?.("(prefers-color-scheme: light)")?.matches ?? false;

    // Palette uses existing blog tokens for dark mode, with a light-mode fallback.
    const dark: Palette = {
      bg: getCssVar("--pixel-bg", "#0d1117"),
      sky: getCssVar("--pixel-surface", "#161b22"),
      buildingA: getCssVar("--pixel-grid", "#21262d"),
      buildingB: getCssVar("--pixel-border", "#30363d"),
      window: getCssVar("--pixel-accent-dim", "#79c0ff"),
      road: getCssVar("--pixel-bg", "#0d1117"),
      sidewalk: getCssVar("--pixel-surface", "#161b22"),
      peopleA: getCssVar("--pixel-accent", "#58a6ff"),
      peopleB: getCssVar("--pixel-accent-dim", "#79c0ff"),
      border: getCssVar("--pixel-border", "#30363d"),
    };

    const light: Palette = {
      bg: "#f6f8fa",
      sky: "#ffffff",
      buildingA: "#e6edf3",
      buildingB: "#c9d1d9",
      window: "#0969da",
      road: "#f6f8fa",
      sidewalk: "#ffffff",
      peopleA: "#0969da",
      peopleB: "#0a58ca",
      border: "#d0d7de",
    };

    const palette = prefersLight ? light : dark;
    const winOff = formatRgba(
      hexToRgb(palette.window) ?? { r: 0, g: 0, b: 0 },
      prefersLight ? 0.25 : 0.15,
    );

    const parent = canvas.parentElement;
    if (!parent) return;

    let w = 0;
    let h = 0;
    let roadTop = 0;
    let buildings: Building[] = [];
    let pedestrians: Ped[] = [];
    let cars: Car[] = [];
    let tick = 0;

    const recalc = () => {
      const rect = parent.getBoundingClientRect();
      const logicalW = Math.max(180, Math.min(320, Math.round(rect.width / 3.8)));
      const logicalH = Math.max(44, Math.min(92, Math.round(rect.height / 3.8)));

      w = logicalW;
      h = logicalH;
      roadTop = Math.floor(h * 0.56);

      canvas.width = w;
      canvas.height = h;

      // Precompute static layout on resize only (keeps runtime cheap).
      const rng = makeRng(w * 97 + h * 131);
      buildings = [];

      const minBuildingH = Math.max(6, Math.floor(roadTop * 0.45));
      let x = -8;
      while (x < w + 8) {
        const bw = Math.max(6, Math.floor(6 + rng() * 18)); // building width
        const bh = Math.max(minBuildingH, Math.floor(6 + rng() * (roadTop - 6)));
        const by = roadTop - bh;
        const variant: 0 | 1 = rng() < 0.55 ? 0 : 1;

        const windows: Array<{ x: number; y: number; on: boolean }> = [];
        // Window grid: dense but small (fast to draw).
        const winStepX = 2 + Math.floor(rng() * 2); // 2..3
        const winStepY = 2; // 2
        for (let wx = x + 1; wx < x + bw - 1; wx += winStepX) {
          for (let wy = by + 1; wy < by + bh - 1; wy += winStepY) {
            const on = ((wx * 31 + wy * 17 + (variant ? 999 : 555)) % 9) < 3;
            windows.push({ x: wx, y: wy, on });
          }
        }

        buildings.push({ x, y: by, w: bw, h: bh, variant, windows });
        x += bw + Math.floor(rng() * 4); // gap 0..3
      }

      pedestrians = [];
      cars = [];
      const lane1 = roadTop + 3;
      const lane2 = roadTop + 10;
      const count = Math.max(6, Math.min(14, Math.floor(w / 28)));
      for (let i = 0; i < count; i++) {
        pedestrians.push({
          id: i,
          x: Math.floor(rng() * w),
          laneY: i % 2 === 0 ? lane1 : lane2,
          speed: 0.45 + rng() * 0.65,
          phase: rng() * 1000,
        });
      }

      const carCount = Math.max(2, Math.min(5, Math.floor(w / 70)));
      for (let i = 0; i < carCount; i++) {
        const dir: 1 | -1 = i % 2 === 0 ? 1 : -1;
        cars.push({
          id: i,
          x: Math.floor(rng() * w),
          laneY: roadTop + (dir === 1 ? 8 : 11),
          speed: 0.35 + rng() * 0.4,
          dir,
          bodyW: 6 + Math.floor(rng() * 2),
          color: i % 2 === 0 ? palette.peopleA : palette.peopleB,
        });
      }

      tick = 0;
    };

    const drawRect = (x: number, y: number, rw: number, rh: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, rw, rh);
    };

    const draw = () => {
      // Background / sky.
      drawRect(0, 0, w, h, palette.bg);
      // Slight "skyline" surface layer.
      drawRect(0, 0, w, roadTop, palette.sky);

      // Sidewalk.
      drawRect(0, roadTop, w, h - roadTop, palette.road);
      drawRect(0, roadTop + 1, w, 3, palette.sidewalk);
      drawRect(0, roadTop + 6, w, 1, palette.sidewalk);

      // Buildings.
      const winOn = palette.window;
      for (const b of buildings) {
        const body = b.variant === 0 ? palette.buildingA : palette.buildingB;
        const outline = palette.border;
        drawRect(b.x, b.y, b.w, b.h, body);
        drawRect(b.x, b.y, b.w, 1, outline);
        drawRect(b.x, b.y + b.h - 1, b.w, 1, outline);
        drawRect(b.x, b.y, 1, b.h, outline);
        drawRect(b.x + b.w - 1, b.y, 1, b.h, outline);

        // Windows (mostly static, with a tiny flicker at low cost).
        const flicker = (tick % 8) < 2;
        for (const win of b.windows) {
          const c = win.on ? winOn : winOff;
          if (win.on) {
            const local = ((win.x * 3 + win.y * 7 + tick) | 0) % 11;
            ctx.fillStyle = flicker && local < 2 ? winOff : c;
            ctx.fillRect(win.x, win.y, 1, 1);
          } else {
            ctx.fillStyle = c;
            ctx.fillRect(win.x, win.y, 1, 1);
          }
        }
      }

      // Cars (8-bit block sprites).
      for (const car of cars) {
        const cx = Math.round(car.x);
        const cy = Math.round(car.laneY);
        if (cx < -12 || cx > w + 12) continue;
        const carBody = car.color;
        const carWindow = winOn;
        const wheel = palette.border;
        // Body + roof
        drawRect(cx, cy - 3, car.bodyW, 2, carBody);
        drawRect(cx + 1, cy - 4, Math.max(2, car.bodyW - 3), 1, carBody);
        // Window
        drawRect(cx + 2, cy - 4, Math.max(1, car.bodyW - 5), 1, carWindow);
        // Wheels
        drawRect(cx + 1, cy - 1, 1, 1, wheel);
        drawRect(cx + car.bodyW - 2, cy - 1, 1, 1, wheel);
      }

      // People (simple 8-bit running sprite made from pixels).
      for (const p of pedestrians) {
        const x = Math.round(p.x);
        const y = Math.round(p.laneY);
        if (x < -8 || x > w + 8) continue;

        const run = (((tick >> 1) + p.id + Math.floor(p.phase)) & 1) === 0;
        const body = palette.peopleA;
        const leg = palette.peopleB;
        const head = palette.peopleB;

        // Body (2x2-ish) + head.
        drawRect(x, y - 5, 2, 3, body);
        ctx.fillStyle = head;
        ctx.fillRect(x + 1, y - 6, 1, 1);

        // Legs (1px each, alternating).
        if (run) {
          drawRect(x, y - 1, 1, 2, leg);
          drawRect(x + 1, y, 1, 2, leg);
        } else {
          drawRect(x, y, 1, 2, leg);
          drawRect(x + 1, y - 1, 1, 2, leg);
        }
        // Arms (simple pixel).
        ctx.fillStyle = palette.border;
        ctx.fillRect(x - 1, y - 3, 1, 1);
        ctx.fillRect(x + 2, y - 3, 1, 1);
      }
    };

    const update = () => {
      tick++;

      // People move right->left and wrap around for continuous motion.
      for (const p of pedestrians) {
        p.x -= p.speed;
        if (p.x < -6) {
          p.x = w + 6 + Math.random() * 10;
        }
      }

      // Cars move both directions and wrap.
      for (const car of cars) {
        car.x += car.speed * car.dir;
        if (car.dir === 1 && car.x > w + 10) {
          car.x = -10 - car.bodyW;
        } else if (car.dir === -1 && car.x < -10 - car.bodyW) {
          car.x = w + 10;
        }
      }
    };

    // Throttle animation to keep CPU usage low.
    const frameMs = 1000 / 8; // ~8 FPS
    let raf = 0;
    let last = 0;
    let alive = true;

    const start = () => {
      if (!alive) return;
      if (document.hidden) {
        // If the tab is hidden, skip work until visible again.
        return;
      }
      raf = requestAnimationFrame(function loop(ts) {
        if (!alive) return;
        if (!reducedMotion && !document.hidden && ts - last >= frameMs) {
          last = ts;
          update();
          draw();
        } else if (reducedMotion) {
          // In reduced motion mode, draw once and stop.
          draw();
          alive = false;
          return;
        } else if (document.hidden) {
          // If hidden, keep scheduling but do minimal work (still low cost).
          // No-op on draw/update.
        }
        raf = requestAnimationFrame(loop);
      });
    };

    // Configure pixelated look.
    ctx.imageSmoothingEnabled = false;

    const ro = new ResizeObserver(() => {
      recalc();
      draw();
    });
    ro.observe(parent);

    // Initial render (next frame to ensure layout is stable).
    requestAnimationFrame(() => {
      recalc();
      draw();
      if (!reducedMotion) start();
    });

    const onVis = () => {
      if (document.hidden) return;
      // Resume by doing one quick draw; next rAF will continue.
      draw();
      last = 0;
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pixelated-canvas pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

