import { readFile } from "node:fs/promises";

const checks = [
  {
    file: "src/components/BackToTop.astro",
    tokens: [
      "corner-actions",
      "back-to-top",
      'aria-label="回到页面顶部"',
      "theme-toggle",
      'aria-label="切换到轻动漫卷轴风格"',
      "data-theme-toggle",
      "waltz-theme",
      "updateThemeColor",
      "var(--corner-action-bg)",
      "var(--corner-action-border)",
      "var(--corner-action-shadow)",
      "var(--corner-action-hover-shadow)",
      "scrollTo",
      "prefers-reduced-motion",
      "data-visible",
    ],
  },
  {
    file: "src/layouts/BaseLayout.astro",
    tokens: [
      "BackToTop",
      "<BackToTop />",
      'data-theme="cyber"',
      "waltz-theme",
      "theme-color",
      "anime-scroll",
      "document.documentElement.dataset.theme",
    ],
  },
  {
    file: "src/styles/global.css",
    tokens: [
      ':root[data-theme="cyber"]',
      ':root[data-theme="anime-scroll"]',
      "--surface-quiet",
      "--line-muted",
      "--scanline-opacity",
      "--glow-soft",
      "--theme-toggle-bg",
      "--button-shadow",
      "--button-hover-shadow",
      "--button-text-shadow",
      "--corner-action-bg",
      "--corner-action-border",
      "--corner-action-shadow",
      "--corner-action-hover-shadow",
      "--paper-texture",
      "--speedline-opacity",
      "--stamp-bg",
      "anime-scroll",
      "body::before",
      "scroll-behavior: smooth",
      ".site-shell::after",
      "--motion-short",
      ".prose h4",
      ".prose a",
      ".prose blockquote",
      ".prose img",
      ".prose table",
      ".prose th",
      ".prose td",
      ".prose hr",
      'html[data-theme="anime-scroll"] .prose blockquote',
      'html[data-theme="anime-scroll"] .prose img',
      'html[data-theme="anime-scroll"] .prose table',
      "overflow-x: auto",
    ],
  },
  {
    file: "src/components/Footer.astro",
    tokens: ["footer-panel::before", "footer-links a:focus-visible"],
  },
  {
    file: "src/components/Header.astro",
    tokens: [
      "nav-home",
      '<a class="nav-home" href="/">首页</a>',
      "grid-template-columns: repeat(5, minmax(0, 1fr));",
    ],
  },
  {
    file: "src/pages/index.astro",
    tokens: [
      "hero-noise",
      "desk-panel",
      "topic-panel",
      "thinking-note",
      "anime-mascot",
      "mascot-scroll",
      "mascot-figure",
      "原创看板人物",
    ],
  },
  {
    file: "src/components/ArticleCard.astro",
    tokens: [
      "article-card",
      "article-card::before",
      "article-desc",
      "color: var(--copy)",
      ':global(:root[data-theme="anime-scroll"]) .card-sheen',
      "animation: none",
    ],
  },
  {
    file: "src/pages/topics/index.astro",
    tokens: [
      ':global(:root[data-theme="anime-scroll"]) .topic-card',
      ':global(:root[data-theme="anime-scroll"]) .topic-groups-section',
      ':global(:root[data-theme="anime-scroll"]) .topic-more',
    ],
  },
  {
    file: "src/pages/topics/[slug].astro",
    tokens: [
      ':global(:root[data-theme="anime-scroll"]) .topic-back',
    ],
  },
  {
    file: "src/pages/articles/[slug].astro",
    tokens: [
      ':global(:root[data-theme="anime-scroll"]) .post-nav a',
      ':global(:root[data-theme="anime-scroll"]) .comments-reserved',
    ],
  },
  {
    file: "src/pages/about.astro",
    tokens: [
      ':global(:root[data-theme="anime-scroll"]) .contact-panel',
      ':global(:root[data-theme="anime-scroll"]) .contact-panel h2',
      ':global(:root[data-theme="anime-scroll"]) .contact-panel p:last-child',
    ],
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
