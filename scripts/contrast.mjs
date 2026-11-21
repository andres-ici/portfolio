// Uso (con npm start en :3000): node scripts/contrast.mjs [carpeta] ["css extra a probar"]
// Mide el contraste real de los textos que se pintan directamente sobre el fondo
// ambiental (sin vidrio) en distintas posiciones de scroll.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = "http://localhost:3000";
const OUT = process.argv[2] ?? "screenshots/contrast";
await mkdir(OUT, { recursive: true });

const targets = [
  { sel: "#top .eyebrow", large: false },
  { sel: ".hero__headline", large: false },
  { sel: "#expertise .section-heading .eyebrow", large: false },
  { sel: "#expertise .section-heading h2", large: true },
  { sel: "#expertise .section-heading > p:last-child", large: false },
  { sel: "#history .section-heading .eyebrow", large: false },
  { sel: "#history .section-heading h2", large: true },
  { sel: "#history .section-heading > p:last-child", large: false },
  { sel: "#projects .section-heading .eyebrow", large: false },
  { sel: "#projects .section-heading > p:last-child", large: false },
  { sel: ".timeline__date", large: false, first: true },
  { sel: ".footer__bottom p", large: false },
  { sel: ".footer__role", large: false },
];
const positions = [0.12, 0.3, 0.5, 0.7, 0.88];
const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch();
const rows = [];

for (const vp of viewports) {
  for (const theme of ["dark", "light"]) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    await ctx.addInitScript((t) => localStorage.setItem("portfolio-theme", t), theme);
    const page = await ctx.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });
    // Reveal everything once so opacity is 1.
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach((e) => e.classList.add("is-visible")));
    await page.waitForTimeout(900);

    if (process.argv[3]) await page.addStyleTag({ content: process.argv[3] });
    await page.waitForTimeout(100);
    for (const t of targets) {
      for (const pos of positions) {
        const info = await page.evaluate(({ sel, pos }) => {
          const el = document.querySelector(sel);
          if (!el) return null;
          const docTop = el.getBoundingClientRect().top + window.scrollY;
          const h = el.getBoundingClientRect().height;
          const target = docTop + h / 2 - window.innerHeight * pos;
          window.scrollTo({ top: Math.max(0, target), behavior: "instant" });
          return true;
        }, { sel: t.sel, pos });
        if (!info) continue;
        await page.waitForTimeout(350);
        const meta = await page.evaluate((sel) => {
          const el = document.querySelector(sel);
          const r = el.getBoundingClientRect();
          const color = getComputedStyle(el).color;
          el.dataset.prevColor = el.style.color;
          el.style.setProperty("color", "transparent", "important");
          el.querySelectorAll("*").forEach((c) => c.style.setProperty("color", "transparent", "important"));
          const bg = getComputedStyle(document.body).backgroundColor;
          return { x: r.left, y: r.top, w: r.width, h: r.height, color, bg, vh: innerHeight };
        }, t.sel);
        // Skip if outside viewport (top-of-page clamp).
        if (meta.y < 0 || meta.y + meta.h > meta.vh) {
          await page.evaluate((sel) => { const el = document.querySelector(sel); el.style.color = ""; el.querySelectorAll("*").forEach((c) => (c.style.color = "")); }, t.sel);
          continue;
        }
        const clip = { x: Math.max(0, meta.x), y: meta.y, width: Math.min(meta.w, vp.width - meta.x), height: meta.h };
        const buf = await page.screenshot({ clip });
        await page.evaluate((sel) => { const el = document.querySelector(sel); el.style.color = ""; el.querySelectorAll("*").forEach((c) => (c.style.color = "")); }, t.sel);

        const stats = await page.evaluate(async ({ b64, color, bg, large }) => {
          const img = new Image();
          img.src = "data:image/png;base64," + b64;
          await img.decode();
          const c = document.createElement("canvas");
          c.width = img.width; c.height = img.height;
          const g = c.getContext("2d");
          g.drawImage(img, 0, 0);
          const d = g.getImageData(0, 0, c.width, c.height).data;
          const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
          const L = (r, gg, b) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b);
          const m = color.match(/[\d.]+/g).map(Number);
          const Lt = L(m[0], m[1], m[2]);
          const bm = bg.match(/[\d.]+/g).map(Number);
          const Lpage = L(bm[0], bm[1], bm[2]);
          const ratios = [];
          const vis = [];
          for (let i = 0; i < d.length; i += 4) {
            const Lb = L(d[i], d[i + 1], d[i + 2]);
            ratios.push((Math.max(Lt, Lb) + 0.05) / (Math.min(Lt, Lb) + 0.05));
            // How much the ribbons stand out from the plain page background.
            vis.push((Math.max(Lpage, Lb) + 0.05) / (Math.min(Lpage, Lb) + 0.05));
          }
          ratios.sort((a, b) => a - b);
          vis.sort((a, b) => a - b);
          const need = large ? 3 : 4.5;
          const below = ratios.filter((r) => r < need).length / ratios.length;
          return { min: ratios[0], p5: ratios[Math.floor(ratios.length * 0.05)], median: ratios[Math.floor(ratios.length / 2)], below, vis: vis[Math.floor(vis.length * 0.95)] };
        }, { b64: buf.toString("base64"), color: meta.color, bg: meta.bg, large: t.large });

        const file = `${OUT}/${vp.name}-${theme}-${t.sel.replace(/[^a-z0-9]+/gi, "_")}-${pos}.png`;
        rows.push({ vp: vp.name, theme, sel: t.sel, pos, color: meta.color, ...stats, file });
        if (stats.below > 0) {
          // keep a visual of failing cases (with text)
          await page.screenshot({ path: file, clip: { x: clip.x, y: Math.max(0, clip.y - 12), width: clip.width, height: Math.min(clip.height + 24, vp.height - Math.max(0, clip.y - 12)) } });
        }
      }
    }
    await ctx.close();
  }
}
await browser.close();

// Aggregate: worst case per vp/theme/selector
const agg = {};
for (const r of rows) {
  const k = `${r.vp}|${r.theme}|${r.sel}`;
  const a = (agg[k] ??= { min: Infinity, p5: Infinity, median: Infinity, below: 0, worstPos: null, color: r.color, n: 0, vis: 0 });
  a.n++;
  a.vis = Math.max(a.vis, r.vis);
  if (r.p5 < a.p5) { a.p5 = r.p5; a.worstPos = r.pos; }
  a.min = Math.min(a.min, r.min);
  a.median = Math.min(a.median, r.median);
  a.below = Math.max(a.below, r.below);
}
// vis = p95 contrast of the background against the plain page colour: how
// visible the ribbons still are behind that text (1 = invisible).
console.log("vp | theme | selector | color | min | p5 | median(min) | max%below | worstPos | n | vis");
for (const [k, a] of Object.entries(agg)) {
  console.log(`${k.replace(/\|/g, " | ")} | ${a.color} | ${a.min.toFixed(2)} | ${a.p5.toFixed(2)} | ${a.median.toFixed(2)} | ${(a.below * 100).toFixed(1)}% | ${a.worstPos} | ${a.n} | ${a.vis.toFixed(2)}`);
}
