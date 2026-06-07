import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const rssPath = path.join(root, "dist", "rss.xml");
const postsDir = path.join(root, "src", "content", "posts");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

if (!existsSync(rssPath)) {
  throw new Error("dist/rss.xml does not exist. Run npm run build first.");
}

const rss = await readFile(rssPath, "utf8");
const postFiles = (await readdir(postsDir)).filter((file) => file.endsWith(".md"));

assert(
  rss.includes("<title>Waltz, Then Think</title>"),
  "RSS channel title is missing."
);
assert(
  rss.includes("Waltz 的个人博客"),
  "RSS channel description is missing."
);
assert(
  rss.includes("https://huaerzi659.github.io/articles/debugging-life/"),
  "Latest article link is missing."
);
assert(
  rss.includes("把生活也当成一次调试"),
  "Latest article title is missing."
);

const itemCount = (rss.match(/<item>/g) ?? []).length;
assert(
  itemCount === postFiles.length,
  `Expected ${postFiles.length} RSS items, got ${itemCount}.`
);

console.log(`RSS verification passed: ${itemCount} items.`);
