import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const site = "https://huaerzi659.github.io";

const checks = [
  {
    file: "index.html",
    canonical: `${site}/`,
    type: "website",
    image: `${site}/images/og-default.png`,
  },
  {
    file: path.join("articles", "stable-internet-access", "index.html"),
    canonical: `${site}/articles/stable-internet-access/`,
    type: "article",
    image: `${site}/images/articles/stable-internet-access/cover-stable-internet-guide.png`,
  },
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function getStructuredData(html, file) {
  const match = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);

  assert(match, `${file}: missing JSON-LD script`);

  try {
    return JSON.parse(match[1]);
  } catch (error) {
    throw new Error(`${file}: JSON-LD is invalid: ${error.message}`);
  }
}

assert(existsSync(dist), "dist directory is missing. Run Astro build before npm run verify:seo.");

for (const check of checks) {
  const htmlPath = path.join(dist, check.file);
  const html = await readFile(htmlPath, "utf8");

  assert(html.includes(`<link rel="canonical" href="${check.canonical}">`), `${check.file}: missing canonical URL`);
  assert(html.includes(`<meta property="og:type" content="${check.type}">`), `${check.file}: missing OG type`);
  assert(html.includes(`<meta property="og:url" content="${check.canonical}">`), `${check.file}: missing OG URL`);
  assert(html.includes(`<meta property="og:image" content="${check.image}">`), `${check.file}: missing OG image`);
  assert(html.includes('<meta name="twitter:card" content="summary_large_image">'), `${check.file}: missing Twitter card`);
  assert(html.includes(`<meta name="twitter:image" content="${check.image}">`), `${check.file}: missing Twitter image`);

  const structuredData = getStructuredData(html, check.file);
  assert(Array.isArray(structuredData), `${check.file}: JSON-LD should be an array`);
  assert(
    structuredData.some((item) => item["@type"] === "WebSite"),
    `${check.file}: JSON-LD should include WebSite`,
  );
  assert(
    structuredData.some((item) => item["@type"] === (check.type === "article" ? "BlogPosting" : "WebPage")),
    `${check.file}: JSON-LD page type is missing`,
  );
}

console.log(`SEO verification passed: ${checks.length} pages checked.`);
