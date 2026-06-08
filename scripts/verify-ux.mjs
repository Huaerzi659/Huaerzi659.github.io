import { readFile } from "node:fs/promises";

const checks = [
  {
    file: "src/components/BackToTop.astro",
    tokens: [
      "back-to-top",
      'aria-label="回到页面顶部"',
      "scrollTo",
      "prefers-reduced-motion",
      "data-visible",
    ],
  },
  {
    file: "src/layouts/BaseLayout.astro",
    tokens: ["BackToTop", "<BackToTop />"],
  },
  {
    file: "src/styles/global.css",
    tokens: [
      "scroll-behavior: smooth",
      ".site-shell::after",
      "--motion-short",
    ],
  },
  {
    file: "src/components/Footer.astro",
    tokens: ["footer-panel::before", "footer-links a:focus-visible"],
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

console.log("UX verification passed.");
