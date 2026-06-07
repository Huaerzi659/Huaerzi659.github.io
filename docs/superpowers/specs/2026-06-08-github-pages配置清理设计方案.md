# GitHub Pages 配置清理设计方案

## 背景

当前博客通过 `.github/workflows/deploy.yml` 在 `main` 分支更新时自动构建并发布到 GitHub Pages。现有配置能工作，但还可以更贴近 GitHub Pages 官方推荐流程，并减少部署维护时的噪音。

## 目标

- 保持 GitHub Pages 自动部署可用。
- 显式加入 GitHub Pages 配置步骤。
- 加 npm 下载缓存，让部署更快、更稳定。
- 构建后运行 RSS 验证，避免 feed 失效后继续部署。
- 上传 Pages artifact 时缩短保留时间，减少无用 artifact 留存。
- 添加 `.nojekyll`，确保 GitHub Pages 不按 Jekyll 规则处理 Astro 构建产物。
- 写一份部署说明文档，方便以后回看。

## 方案

更新 `.github/workflows/deploy.yml`：

- 使用当前官方示例中的 Pages 专用流程：checkout、configure-pages、setup-node、install、build、verify、upload artifact、deploy。
- Node 版本固定为 24，满足 Astro 6 的运行要求。
- 使用 npm 缓存目录 `~/.npm`，缓存 key 基于 `package.json`。
- 使用 `npm install --no-audit --no-fund`，符合当前仓库没有远端 lockfile 的状态。
- 上传 artifact 时设置 `retention-days: 1`。
- 并发策略改为新提交取消旧部署，避免快速连续更新时排队部署旧版本。

新增 `public/.nojekyll`，让 Astro 构建后把 `.nojekyll` 复制到 `dist/.nojekyll`。

新增 `docs/github-pages-deploy.md`，说明部署步骤和每个配置项的作用。

## 验证

- 本地使用 Node 24 运行 Astro build。
- 本地运行 `scripts/verify-rss.mjs`。
- 检查 `dist/.nojekyll` 存在。
- 静态检查 workflow 包含 Pages 配置、缓存、RSS 验证和 artifact 保留时间。
