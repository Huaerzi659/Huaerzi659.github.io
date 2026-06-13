import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const checks = [
  {
    file: "src/pages/articles/[slug].astro",
    tokens: [
      "ArticleEnhancements",
      "ArticleToc",
      "RelatedPosts",
      "headings",
      "hasToc",
      "relatedPosts",
      ":global(.related-posts)",
      "上一篇",
      "下一篇",
    ],
  },
  {
    file: "src/components/ArticleEnhancements.astro",
    tokens: [
      "reading-progress",
      "copy-code-button",
      "navigator.clipboard.writeText",
      "scrollHeight",
      "aria-label",
    ],
  },
  {
    file: "src/components/ArticleToc.astro",
    tokens: [
      "article-toc",
      "目录",
      "toc-link",
      "depth",
    ],
  },
  {
    file: "src/components/RelatedPosts.astro",
    tokens: [
      "related-posts",
      "相关文章",
      "ArticleCard",
    ],
  },
  {
    file: "src/lib/posts.ts",
    tokens: [
      "getRelatedPosts",
      "sharedTags",
      "fallbackPosts",
    ],
  },
];

for (const check of checks) {
  if (!existsSync(check.file)) {
    throw new Error(`${check.file} is missing`);
  }

  const content = await readFile(check.file, "utf8");

  for (const token of check.tokens) {
    if (!content.includes(token)) {
      throw new Error(`${check.file} is missing ${token}`);
    }
  }
}

console.log("Reading experience verification passed.");
