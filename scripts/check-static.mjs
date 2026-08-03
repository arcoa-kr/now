import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const requiredFiles = [
  "index.html",
  "styles.css",
  "src/data.js",
  "src/app.js",
  "assets/favicon.svg",
  "assets/og-image.png",
  "assets/ARCOA-header.png",
  "assets/ARCOA-footer.png",
  "assets/LINESeedKR-Rg.woff2",
  "assets/LINESeedKR-Bd.woff2",
  "CNAME"
];

for (const relativePath of requiredFiles) {
  await access(join(root, relativePath));
}

const html = await readFile(join(root, "index.html"), "utf8");
const cname = (await readFile(join(root, "CNAME"), "utf8")).trim();

for (const reference of [
  "./styles.css",
  "./src/data.js",
  "./src/app.js",
  "./assets/favicon.svg",
  "./assets/ARCOA-header.png",
  "./assets/ARCOA-footer.png",
  "./assets/LINESeedKR-Rg.woff2",
  "./assets/LINESeedKR-Bd.woff2",
  "assets/og-image.png"
]) {
  if (!html.includes(reference)) {
    throw new Error(`Missing HTML reference: ${reference}`);
  }
}

if (html.includes("og-image.svg")) {
  throw new Error("The old SVG OG image is still referenced.");
}

if (cname !== "now.arcoa.kr") {
  throw new Error(`Unexpected CNAME value: ${cname}`);
}

console.log(`Static build check passed: ${requiredFiles.length} files verified.`);
