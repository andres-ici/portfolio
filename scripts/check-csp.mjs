// Postbuild guard for Cloudflare Pages.
// 1. Every inline <script> in build/index.html must be allowed by a sha256 hash
//    in the Content-Security-Policy of build/_headers; otherwise the browser
//    would block it in production (e.g. the anti-flash theme script).
// 2. Source maps must not be shipped unless explicitly requested with
//    GENERATE_SOURCEMAP=true (local bundle analysis).
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const BUILD = "build";
const errors = [];

const html = await readFile(path.join(BUILD, "index.html"), "utf8");
const headers = await readFile(path.join(BUILD, "_headers"), "utf8").catch(() => {
  errors.push("No existe build/_headers (debe venir de public/_headers).");
  return "";
});

const csp = headers
  .split("\n")
  .map((line) => line.trim())
  .find((line) => line.toLowerCase().startsWith("content-security-policy:"));

if (headers && !csp) {
  errors.push("build/_headers no define Content-Security-Policy.");
}

const scriptSrc = csp?.match(/script-src([^;]*)/)?.[1] ?? "";
const inlineScripts = [...html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)]
  .filter(([, attrs = ""]) => !/\ssrc=/.test(attrs) && !/application\/ld\+json/.test(attrs))
  .map(([, , body]) => body)
  .filter((body) => body.length > 0);

for (const body of inlineScripts) {
  const hash = `'sha256-${createHash("sha256").update(body, "utf8").digest("base64")}'`;
  if (!scriptSrc.includes(hash)) {
    errors.push(
      `Script inline sin hash en la CSP. Agrega ${hash} a script-src en public/_headers.`
    );
  }
}

if (process.env.GENERATE_SOURCEMAP !== "true") {
  const files = await readdir(path.join(BUILD, "static"), { recursive: true });
  const maps = files.filter((file) => file.endsWith(".map"));
  if (maps.length > 0) {
    errors.push(`Se generaron source maps en producción: ${maps.join(", ")}`);
  }
}

if (errors.length > 0) {
  console.error("\ncheck-csp: el build no es apto para publicar:");
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

console.log(`check-csp: OK (${inlineScripts.length} script(s) inline cubiertos por la CSP).`);
