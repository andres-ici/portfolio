import React, { useEffect, useRef } from "react";
import "../assets/styles/AmbientBackground.scss";

/* --------------------------------------------------------------------------
   Background artwork.

   The ribbons are generated from a handful of control points: each strand is
   offset along the curve normal, and the bundle width is modulated by the
   `pinch` array so the lines converge and separate like the original
   bg-dark / bg-light template artwork. Paths are built once at module load.

   The SVG itself stays static: only the wrapper layers are transformed, so
   the artwork is rasterized once and the browsers can keep it on its own
   compositor layer instead of repainting ~70 gradient strokes per frame.
   -------------------------------------------------------------------------- */

type Point = [number, number];

interface RibbonSpec {
  id: string;
  className: string;
  gradientId: string;
  center: Point[];
  pinch: number[];
  spread: number;
  strands: number;
}

interface RibbonStrand {
  d: string;
  opacity: number;
}

const RIBBON_SPECS: RibbonSpec[] = [
  {
    id: "main",
    className: "ambient__ribbon--main",
    gradientId: "ambient-ribbon-warm",
    center: [
      [-260, 840],
      [60, 760],
      [330, 700],
      [560, 660],
      [780, 720],
      [980, 690],
      [1120, 470],
      [1250, 300],
      [1430, 235],
      [1620, 270],
      [1880, 420],
    ],
    pinch: [0.55, 0.35, 0.9, 0.2, 1, 0.3, 0.95, 0.22, 0.75, 1, 0.4],
    spread: 118,
    strands: 27,
  },
  {
    id: "upper",
    className: "ambient__ribbon--upper",
    gradientId: "ambient-ribbon-cool",
    center: [
      [-260, 140],
      [100, 230],
      [400, 330],
      [700, 390],
      [980, 360],
      [1230, 240],
      [1480, 110],
      [1820, 60],
    ],
    pinch: [0.7, 0.25, 1, 0.4, 0.85, 0.3, 1, 0.5],
    spread: 96,
    strands: 20,
  },
  {
    id: "lower",
    className: "ambient__ribbon--lower",
    gradientId: "ambient-ribbon-warm",
    center: [
      [780, 1180],
      [1030, 1020],
      [1240, 930],
      [1440, 900],
      [1700, 830],
      [1900, 760],
    ],
    pinch: [0.5, 0.9, 0.3, 1, 0.4, 0.8],
    spread: 90,
    strands: 15,
  },
];

function smoothPath(points: Point[]): string {
  if (points.length < 2) return "";

  let d = `M${points[0][0].toFixed(1)},${points[0][1].toFixed(1)}`;

  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? points[i + 1];

    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;

    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }

  return d;
}

function curveNormals(points: Point[]): Point[] {
  return points.map((_, index) => {
    const prev = points[Math.max(0, index - 1)];
    const next = points[Math.min(points.length - 1, index + 1)];
    const dx = next[0] - prev[0];
    const dy = next[1] - prev[1];
    const length = Math.hypot(dx, dy) || 1;
    return [-dy / length, dx / length];
  });
}

function buildRibbon(spec: RibbonSpec): RibbonStrand[] {
  const normals = curveNormals(spec.center);

  return Array.from({ length: spec.strands }, (_, strand) => {
    const t = spec.strands === 1 ? 0 : strand / (spec.strands - 1) - 0.5;
    const edge = Math.abs(t) * 2;

    const points = spec.center.map((point, index) => {
      const offset = spec.spread * spec.pinch[index] * t * 2;
      return [
        point[0] + normals[index][0] * offset,
        point[1] + normals[index][1] * offset,
      ] as Point;
    });

    return {
      d: smoothPath(points),
      opacity: Number((1 - Math.pow(edge, 2.2) * 0.85).toFixed(3)),
    };
  });
}

const RIBBON_LAYERS = RIBBON_SPECS.map((spec) => ({
  ...spec,
  strands: buildRibbon(spec),
}));

function AmbientBackground() {
  const ref = useRef<HTMLDivElement>(null);

  // Scroll parallax plus an animation budget: once the hero is left behind the
  // background freezes (it sits under the glass cards anyway), and it also
  // pauses whenever the tab is hidden.
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    let frame = 0;
    let calm = false;

    const setCalm = (next: boolean) => {
      if (next === calm) return;
      calm = next;
      element.classList.toggle("ambient--calm", calm);
    };

    const update = () => {
      frame = 0;
      const y = window.scrollY || 0;
      const shift = Math.min(y, 2400) * 0.035;
      element.style.setProperty("--ambient-shift", `${shift.toFixed(1)}px`);
      setCalm(y > window.innerHeight * 0.9);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    const onVisibility = () => {
      element.classList.toggle("ambient--paused", document.hidden);
    };

    update();
    onVisibility();
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="ambient"
      ref={ref}
      aria-hidden="true"
    >
      <div className="ambient__base" />

      <div className="ambient__ribbons">
        <div className="ambient__ribbons-drift">
          <svg
            className="ambient__ribbon-svg"
            viewBox="0 0 1600 1000"
            preserveAspectRatio="xMidYMid slice"
            focusable="false"
          >
            <defs>
              <linearGradient id="ambient-ribbon-warm" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" className="ambient__stop ambient__stop--warm" />
                <stop offset="52%" className="ambient__stop ambient__stop--mid" />
                <stop offset="100%" className="ambient__stop ambient__stop--cool" />
              </linearGradient>
              <linearGradient id="ambient-ribbon-cool" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" className="ambient__stop ambient__stop--cool" />
                <stop offset="58%" className="ambient__stop ambient__stop--mid" />
                <stop offset="100%" className="ambient__stop ambient__stop--warm" />
              </linearGradient>
            </defs>

            {RIBBON_LAYERS.map((layer) => (
              <g
                key={layer.id}
                className={`ambient__ribbon ${layer.className}`}
                stroke={`url(#${layer.gradientId})`}
              >
                {layer.strands.map((strand, index) => (
                  <path
                    key={`${layer.id}-${index}`}
                    d={strand.d}
                    opacity={strand.opacity}
                  />
                ))}
              </g>
            ))}
          </svg>
        </div>
      </div>

      <div className="ambient__glow ambient__glow--violet" />
      <div className="ambient__glow ambient__glow--blue" />

      <div className="ambient__sheen" />

      <div className="ambient__grain" />
      <div className="ambient__vignette" />
    </div>
  );
}

export default AmbientBackground;
