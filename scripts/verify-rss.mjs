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
const posts = await Promise.all(
  postFiles.map(async (file) => {
    const markdown = await readFile(path.join(postsDir, file), "utf8");
    const frontmatter = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    assert(frontmatter, `Missing frontmatter: ${file}`);

    const get = (key) => {
      const found = frontmatter[1].match(new RegExp(`^${key}:\\s*["']?(.+?)["']?$`, "m"));
      return found?.[1]?.trim();
    };

    return {
      slug: file.replace(/\.md$/, ""),
      title: get("title"),
      date: new Date(get("date")),
    };
  })
);
const latestPost = posts.sort((a, b) => b.date.getTime() - a.date.getTime())[0];

assert(
  rss.includes("<title>Waltz, Then Think</title>"),
  "RSS channel title is missing."
);
assert(
  rss.includes("Waltz 的个人博客"),
  "RSS channel description is missing."
);
assert(
  rss.includes(`https://huaerzi659.github.io/articles/${latestPost.slug}/`),
  "Latest article link is missing."
);
assert(
  rss.includes(latestPost.title),
  "Latest article title is missing."
);

const itemCount = (rss.match(/<item>/g) ?? []).length;
assert(
  itemCount === postFiles.length,
  `Expected ${postFiles.length} RSS items, got ${itemCount}.`
);

console.log(`RSS verification passed: ${itemCount} items.`);
