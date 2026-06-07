# GitHub Pages 配置清理 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 清理 GitHub Pages 部署配置，让 Astro 博客发布流程更标准、可验证、易维护。

**Architecture:** 只修改部署配置和部署文档，不改页面 UI。Workflow 继续在 `main` push 和手动触发时运行，build job 产出 `dist` artifact，deploy job 发布到 GitHub Pages。

**Tech Stack:** GitHub Actions、GitHub Pages、Astro、npm、Node.js 24。

---

### Task 1: 更新 Pages workflow

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Replace workflow content**

Use a clearer deployment pipeline:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages-${{ github.ref }}
  cancel-in-progress: true

jobs:
  build:
    name: Build site
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - name: Checkout
        uses: actions/checkout@v6

      - name: Configure GitHub Pages
        uses: actions/configure-pages@v5

      - name: Setup Node
        uses: actions/setup-node@v6
        with:
          node-version: 24

      - name: Cache npm downloads
        uses: actions/cache@v4
        with:
          path: ~/.npm
          key: ${{ runner.os }}-npm-${{ hashFiles('package.json') }}
          restore-keys: |
            ${{ runner.os }}-npm-

      - name: Install dependencies
        run: npm install --no-audit --no-fund

      - name: Build
        run: npm run build

      - name: Verify RSS feed
        run: npm run verify:rss

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v4
        with:
          path: ./dist
          retention-days: 1

  deploy:
    name: Deploy site
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    timeout-minutes: 10
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### Task 2: Add Pages static marker and docs

**Files:**
- Create: `public/.nojekyll`
- Create: `docs/github-pages-deploy.md`

- [ ] **Step 1: Add `.nojekyll` marker**

Create an empty `public/.nojekyll` file.

- [ ] **Step 2: Add deployment notes**

Create `docs/github-pages-deploy.md` explaining:

- when deployment runs
- why `configure-pages` exists
- why npm cache exists
- why `.nojekyll` exists
- why RSS verification runs before upload

### Task 3: Verify locally

**Files:**
- None

- [ ] **Step 1: Build**

Run Astro build with Node 24.

Expected: build completes and emits `dist/rss.xml` plus `dist/.nojekyll`.

- [ ] **Step 2: RSS verification**

Run `scripts/verify-rss.mjs`.

Expected: `RSS verification passed: 3 items.`

- [ ] **Step 3: Static workflow check**

Check `.github/workflows/deploy.yml` contains:

- `actions/configure-pages@v5`
- `actions/setup-node@v6`
- `actions/cache@v4`
- `actions/upload-pages-artifact@v4`
- `retention-days: 1`
- `npm run verify:rss`
