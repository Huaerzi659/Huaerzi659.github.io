# GitHub Pages 部署说明

这个博客通过 GitHub Actions 发布到 GitHub Pages。每次 `main` 分支更新，workflow 会重新构建 Astro 站点，并把 `dist/` 上传给 Pages。

## 流程

1. Checkout 仓库代码。
2. 配置 GitHub Pages 部署环境。
3. 安装 Node.js 24。
4. 缓存 npm 下载目录，减少重复下载。
5. 安装依赖。
6. 构建 Astro 静态站点。
7. 验证 RSS feed。
8. 上传 `dist/` 为 Pages artifact。
9. 部署 artifact 到 GitHub Pages。

## 配置说明

- `actions/configure-pages`: 显式初始化 Pages 部署上下文，贴近 GitHub 官方自定义 workflow 流程。
- `actions/cache`: 缓存 npm 下载内容，让后续部署少做重复网络下载。
- `npm install --no-audit --no-fund`: 安装依赖时减少与部署无关的输出。
- `npm run verify:rss`: 构建后先检查 RSS，再发布站点，避免 feed 损坏。
- `retention-days: 1`: Pages artifact 只需要短期保留，减少仓库 Actions artifact 噪音。
- `public/.nojekyll`: 让 GitHub Pages 跳过 Jekyll 处理，按 Astro 产物原样提供静态文件。

## 手动部署

可以在 GitHub 仓库的 Actions 页面选择 `Deploy to GitHub Pages`，然后手动运行 `workflow_dispatch`。
