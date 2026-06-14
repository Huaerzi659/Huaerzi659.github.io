import { readFile } from "node:fs/promises";

const checks = [
  {
    file: "src/styles/global.css",
    tokens: [
      "--ease-out",
      "--motion-short",
      "@keyframes panel-enter",
      "@keyframes signal-pulse",
      "@keyframes sheen-pass",
      "prefers-reduced-motion",
    ],
  },
  {
    file: "src/pages/index.astro",
    tokens: ["hero-hud", "hero-scanline", "hero-scanline-pass", "status-pulse", 'data-theme="minimal"'],
  },
  {
    file: "src/components/ArticleCard.astro",
    tokens: ["card-sheen"],
  },
  {
    file: "src/components/TagPill.astro",
    tokens: ["tag-sheen"],
  },
  {
    file: "src/components/BackToTop.astro",
    tokens: ["scrollTo", "prefers-reduced-motion", "motionQuery.matches"],
  },
  {
    file: "src/components/ArticleEnhancements.astro",
    tokens: ["requestAnimationFrame", "copy-code-button", 'data-copied="true"'],
  },
];

for (const check of checks) {
  const content = await readFile(check.file, "utf8");

  for (const token of check.tokens) {
    if (!content.includes(token)) {
      throw new Error(`${check.file} is missing ${token}`);
    }
  }
}

console.log("Motion verification passed.");
