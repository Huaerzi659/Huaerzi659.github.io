import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const postsDir = path.join(root, "src", "content", "posts");
const imageRootPrefix = "/images/articles/";
const allowedTags = new Set(["技术", "经验", "感想", "灵感", "工具", "复盘"]);
const filenamePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

const failures = [];

function addFailure(file, message) {
  failures.push(`${file}: ${message}`);
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);

  if (!match) {
    return { data: null, body: markdown };
  }

  const raw = match[1];
  const body = markdown.slice(match[0].length);
  const data = {};

  for (const line of raw.split(/\r?\n/)) {
    const found = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);

    if (found) {
      data[found[1]] = found[2].trim();
    }
  }

  return { data, body };
}

function unquote(value = "") {
  return value.replace(/^["']|["']$/g, "").trim();
}

function parseInlineArray(value = "") {
  const trimmed = value.trim();

  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) {
    return null;
  }

  const inside = trimmed.slice(1, -1).trim();

  if (!inside) {
    return [];
  }

  return inside
    .split(",")
    .map((item) => unquote(item.trim()))
    .filter(Boolean);
}

function checkFrontmatter(file, data) {
  if (!data) {
    addFailure(file, "missing frontmatter block");
    return;
  }

  for (const key of ["title", "description", "date", "tags", "featured"]) {
    if (!(key in data)) {
      addFailure(file, `missing frontmatter field: ${key}`);
    }
  }

  const title = unquote(data.title);
  const description = unquote(data.description);
  const date = unquote(data.date);
  const tags = parseInlineArray(data.tags);
  const featured = data.featured;

  if (title && (title.length < 2 || title.length > 40)) {
    addFailure(file, "title should be between 2 and 40 characters");
  }

  if (description && (description.length < 20 || description.length > 120)) {
    addFailure(file, "description should be between 20 and 120 characters");
  }

  if (date && !datePattern.test(date)) {
    addFailure(file, "date must use YYYY-MM-DD format");
  }

  if (featured && !["true", "false"].includes(featured)) {
    addFailure(file, "featured must be true or false");
  }

  if (!Array.isArray(tags)) {
    addFailure(file, 'tags must use inline array syntax, for example ["技术", "经验"]');
    return;
  }

  if (tags.length < 1 || tags.length > 3) {
    addFailure(file, "tags should contain 1 to 3 items");
  }

  for (const tag of tags) {
    if (!allowedTags.has(tag)) {
      addFailure(file, `unknown tag "${tag}". Allowed tags: ${Array.from(allowedTags).join(", ")}`);
    }
  }
}

function checkHeadings(file, body) {
  const headingLevels = [];

  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^(#{1,6})\s+\S/);

    if (!heading) {
      continue;
    }

    const level = heading[1].length;

    if (level === 1) {
      addFailure(file, "body should not contain # headings; frontmatter title renders the page h1");
    }

    headingLevels.push(level);
  }

  for (let index = 1; index < headingLevels.length; index += 1) {
    const previous = headingLevels[index - 1];
    const current = headingLevels[index];

    if (current > previous + 1) {
      addFailure(file, `heading level jumps from h${previous} to h${current}`);
    }
  }
}

function checkImages(file, body) {
  const images = body.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g);

  for (const image of images) {
    const alt = image[1].trim();
    const src = image[2].trim();

    if (!alt) {
      addFailure(file, `image ${src} is missing alt text`);
    }

    if (!src.startsWith("/")) {
      continue;
    }

    if (!src.startsWith(imageRootPrefix)) {
      addFailure(file, `local image ${src} should live under ${imageRootPrefix}`);
      continue;
    }

    const localPath = path.join(root, "public", src.replace(/^\//, ""));

    if (!existsSync(localPath)) {
      addFailure(file, `local image does not exist: ${src}`);
    }

    const imageFile = path.basename(src);

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.(svg|png|jpg|jpeg|webp|gif)$/.test(imageFile)) {
      addFailure(file, `image filename should use lowercase kebab-case: ${imageFile}`);
    }
  }
}

function checkCodeFences(file, body) {
  const fenceCount = (body.match(/^```/gm) ?? []).length;

  if (fenceCount % 2 !== 0) {
    addFailure(file, "code fences must be paired");
  }
}

function isPipeRow(line) {
  const trimmed = line.trim();

  return trimmed.startsWith("|") && trimmed.endsWith("|");
}

function isSeparatorRow(line = "") {
  return /^\|[\s:-]+\|(?:[\s:-]+\|)*$/.test(line.trim());
}

function checkTables(file, body) {
  const lines = body.split(/\r?\n/);
  let inTable = false;

  for (let index = 0; index < lines.length; index += 1) {
    const current = lines[index];
    const next = lines[index + 1] ?? "";

    if (isSeparatorRow(current)) {
      inTable = true;
      continue;
    }

    if (!isPipeRow(current)) {
      inTable = false;
      continue;
    }

    if (isSeparatorRow(next)) {
      inTable = true;
      continue;
    }

    if (!inTable) {
      addFailure(file, `table header on line ${index + 1} must be followed by a separator row`);
    }
  }
}

const postFiles = (await readdir(postsDir)).filter((file) => file.endsWith(".md"));

if (postFiles.length === 0) {
  addFailure("src/content/posts", "no Markdown posts found");
}

for (const file of postFiles) {
  if (!filenamePattern.test(file)) {
    addFailure(file, "filename must use lowercase kebab-case");
  }

  const markdown = await readFile(path.join(postsDir, file), "utf8");
  const { data, body } = parseFrontmatter(markdown);

  checkFrontmatter(file, data);
  checkHeadings(file, body);
  checkImages(file, body);
  checkCodeFences(file, body);
  checkTables(file, body);
}

if (failures.length > 0) {
  console.error("Content verification failed:");

  for (const failure of failures) {
    console.error(`- ${failure}`);
  }

  process.exit(1);
}

console.log(`Content verification passed: ${postFiles.length} posts checked.`);
