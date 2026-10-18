---
title: 用 VitePress 搭一个零成本博客
date: 2026-09-18
tags: [建站, VitePress, GitHub Pages]
description: 一台电脑、一个 GitHub 仓库、零元预算，就能拥有一个加载飞快、可以一直写下去的博客。
---

## 为什么是静态站点

博客最常见的死法不是没内容，而是维护成本太高：服务器要续费、WordPress 要升级、插件突然不兼容、数据库某天连不上。折腾一圈之后，写作的力气已经用完了。

静态站点把这些问题一次性绕开：文章就是 Markdown 文件，构建产物是一堆 HTML，没有数据库、没有运行时、没有需要打补丁的服务器。托管成本接近零，十年后把仓库 clone 下来还能重新构建出一样的站点。

```text
Markdown 源文件  →  VitePress 构建  →  静态 HTML / CSS / JS  →  GitHub Pages
     （Git 管理）        （GitHub Actions）        （免费 CDN）
```

## 为什么选 VitePress

我试过不少方案，最后留下 VitePress，理由是它同时满足三件事：

- **写作体验干净**：Markdown + frontmatter，没有后台，也没有预览和线上不一致的问题。
- **产物足够轻**：默认不加载多余脚本，首屏通常只有几十 KB，手机流量也不心疼。
- **自带我要的功能**：本地全文搜索、深色模式、侧边栏、代码高亮、SEO 友好的静态 HTML。

和另外几个常见选择对比：

| 方案 | 优势 | 代价 |
| --- | --- | --- |
| VitePress | 配置少、搜索开箱可用、Vue 组件可嵌入 | 偏文档风格，博客感需要自己补 |
| Hexo | 主题生态庞大，中文教程多 | 插件质量参差，构建偏慢 |
| Hugo | 构建极快，单二进制 | Go 模板语法学习曲线陡 |
| Astro | 内容集合、性能极佳 | 概念更多，配置更重 |

如果你只想尽快开始写，VitePress 的投入产出比是最高的。

## 目录结构

这个仓库的骨架大致是这样，删掉任何一层都不会影响其他部分：

```text
blog/
├─ docs/
│  ├─ .vitepress/
│  │  ├─ config.mts          # 站点配置：导航、搜索、侧边栏
│  │  ├─ posts.data.mts      # 构建期收集全部文章
│  │  ├─ sidebar.mts         # 根据文件自动生成侧边栏
│  │  └─ theme/              # 自定义主题与组件
│  ├─ notes/                 # 技术笔记
│  ├─ essays/                # 生活随笔
│  ├─ public/                # 图片、图标等静态资源
│  └─ index.md               # 首页
├─ .github/workflows/        # 自动部署
└─ package.json
```

## 三个关键配置

第一是 `base`。GitHub Pages 的项目站点地址形如 `https://用户名.github.io/仓库名/`，所以构建时要把 base 设为 `/仓库名/`，否则 CSS 和图片全部 404。

```ts
const base = process.env.BASE || '/'
```

第二是中文搜索。VitePress 的本地搜索基于 MiniSearch，默认按空格分词，中文会退化成一整句匹配。用 `Intl.Segmenter` 重新分词之后，搜「部署」也能命中「自动部署」：

```ts
tokenize: (text: string) => {
  const segmenter = new Intl.Segmenter('zh', { granularity: 'word' })
  return Array.from(segmenter.segment(text))
    .filter((part) => part.isWordLike)
    .map((part) => part.segment)
}
```

第三是"内容即数据"。侧边栏、首页最新文章、标签页都从同一份扫描结果来，新增文章不需要改任何列表：

```ts
const posts = scanPosts().sort((a, b) => (a.date < b.date ? 1 : -1))
```

::: tip 一个反直觉的经验
博客最贵的不是服务器，是"想改点什么却发现改不动"的挫败感。所有配置都写成纯文本、放在仓库里，比任何可视化后台都更抗时间。
:::

## 上线

推送到 GitHub，在仓库的 **Settings → Pages** 里把 Source 选成 **GitHub Actions**，之后每次 `git push` 都会自动构建部署，一分钱不花。

下一篇会详细写这套 Actions 配置，包括缓存、并发控制和自定义域名。
