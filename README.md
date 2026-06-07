# Waltz, Then Think

Waltz 的个人博客：技术、经验、感想与灵感。

## 本地开发

```powershell
npm install
npm run dev
```

## 构建

```powershell
npm run build
```

## 写文章

在 `src/content/posts/` 下新增 Markdown 文件：

```yaml
---
title: "文章标题"
description: "文章摘要"
date: "2026-06-07"
tags: ["技术", "感想"]
featured: false
---
```

`featured: true` 的文章会出现在首页精选区域。

## RSS

订阅地址：`https://Huaerzi659.github.io/rss.xml`

## UI/UX Skill

本项目已按用户要求安装 `ui-ux-pro-max`：

```powershell
npm install -g --prefix C:\Users\刘\Documents\Codex\npm-global uipro-cli
uipro init --ai codex
```

后续调整前端视觉、布局和交互时，优先参考 `.codex/skills/ui-ux-pro-max/`。

## 上线

第一版使用 GitHub Pages。推荐仓库名为 `Huaerzi659.github.io`。
