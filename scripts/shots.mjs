import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";

const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const OUT = "screenshots";

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];
const shots = [
  { name: "hero", anchor: null },
  { name: "expertise", anchor: "#expertise" },
  { name: "projects", anchor: "#projects" },
];

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch();

for (const vp of viewports) {
  for (const theme of ["dark", "light"]) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      reducedMotion: "reduce",
    });

    await context.addInitScript((t) => {
      localStorage.setItem("portfolio-theme", t);
    }, theme);

    const page = await context.newPage();
    await page.goto(BASE, { waitUntil: "networkidle" });

    for (const shot of shots) {
      if (shot.anchor) {
        await page.locator(shot.anchor).scrollIntoViewIfNeeded();
        await page.waitForTimeout(250);
      }
      await page.screenshot({
        path: `${OUT}/${vp.name}-${theme}-${shot.name}.png`,
      });
    }

    await context.close();
  }
}

await browser.close();
console.log(`Listo: ${OUT}/`);
