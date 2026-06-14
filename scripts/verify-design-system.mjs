import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

const fileChecks = [
  {
    file: "docs/视觉系统.md",
    tokens: [
      "# Waltz, Then Think 视觉系统",
      "cyber",
      "anime-scroll",
      "minimal",
      "彩色玻璃感",
      "按钮类型",
      "标签类型",
      "卡片状态",
      "颜色变量",
      "prefers-reduced-motion",
    ],
  },
  {
    file: "src/styles/global.css",
    tokens: [
      ':root[data-theme="minimal"]',
      'html[data-theme="minimal"]',
      "--bg-grid",
      "--surface-quiet",
      "--button-border",
      "--corner-action-bg",
      "--scanline-opacity: 0",
      "--glass-blue",
      "--glass-mint",
      "--glass-coral",
      "--glass-lilac",
    ],
  },
  {
    file: "src/layouts/BaseLayout.astro",
    tokens: [
      'new Set(["cyber", "anime-scroll", "minimal"])',
      'minimal: "#f8fbff"',
      'theme === "cyber" ? "dark" : "light"',
    ],
  },
  {
    file: "src/components/BackToTop.astro",
    tokens: [
      'next: "minimal"',
      'next: "cyber"',
      'minimal: "#f8fbff"',
      'nextTheme === "cyber" ? "dark" : "light"',
      'icon: "彩"',
    ],
  },
  {
    file: "scripts/verify-ux.mjs",
    tokens: [
      ':root[data-theme="minimal"]',
      "minimal",
      "verify-design-system",
    ],
  },
  {
    file: "scripts/verify-motion.mjs",
    tokens: [
      "prefers-reduced-motion",
      "hero-scanline-pass",
      "scrollTo",
      "requestAnimationFrame",
    ],
  },
];

for (const check of fileChecks) {
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

console.log("Design system verification passed.");
