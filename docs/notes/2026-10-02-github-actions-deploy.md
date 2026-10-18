---
title: 用 GitHub Actions 自动部署博客
date: 2026-10-02
tags: [GitHub Actions, 部署, 建站]
description: 一份可以直接抄的 workflow：push 即部署、带缓存、带并发控制，还顺手解决了最后更新时间和小众报错。
---

## 目标

`git push` 之后什么都不用做，一分钟内线上就是最新版本。这需要三样东西：仓库里的 workflow 文件、Pages 的权限配置、以及一次性的 Pages 源设置。

## 完整配置

把下面这段存成 `.github/workflows/deploy.yml`：

```yaml
name: Deploy Blog

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          BASE: /blog/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

## 几个容易踩的坑

**`fetch-depth: 0` 不是可选项。** VitePress 的「最后更新时间」依赖 `git log`，浅克隆只有一条提交记录，所有文章的更新时间都会变成同一个日期。

**`BASE` 必须和仓库名一致。** 项目站点的路径是 `/仓库名/`，漏掉这一步的典型症状是：HTML 打开了，但页面完全没样式，控制台一片 404。

**权限写在 workflow 里，而不是只点界面。** `pages: write` 和 `id-token: write` 缺一不可，否则 deploy 步骤会报 `Get Pages site failed`。

**`concurrency` 避免重复部署。** 连续推两次时，旧任务不应和新任务抢同一个 environment。`cancel-in-progress: false` 让上一轮体面跑完，比强行中断更稳。

## 一次性设置

部署成功还差一步：仓库 **Settings → Pages → Build and deployment → Source** 选 **GitHub Actions**。选成 "Deploy from a branch" 的话，Actions 会跑成功，但线上页面永远是旧的。

如果你的仓库是私有的，Pages 需要 GitHub Pro；公开仓库则完全免费。

## 自定义域名的收尾

买了域名之后，在仓库根目录放一个 `CNAME` 文件，内容就是裸域名：

```text
liny.me
```

然后在 DNS 里加两条记录：

| 类型 | 名称 | 值 |
| --- | --- | --- |
| A | @ | `185.199.108.153` 等四条 |
| CNAME | www | `yqlg.github.io` |

最后在 Pages 里勾选 **Enforce HTTPS**。注意：绑定自定义域名后站点挂在根路径，构建时的 `BASE` 要改回 `/`。

::: warning 国内的现实
`github.io` 在国内访问时快时慢。我的做法是主站放在 GitHub Pages，同时用 Cloudflare Pages 连同一个仓库做镜像，访问不了主站时还有备胎。
:::

## 排查清单

- 页面 404：确认 Pages 的 Source 是 GitHub Actions，且仓库名与 `BASE` 一致。
- 样式丢失：`BASE` 少了结尾的斜杠，或写成仓库地址的完整 URL。
- 部署权限报错：检查 workflow 顶层的 `permissions` 段。
- 构建卡住：看 Actions 日志里 `npm ci` 是否命中缓存，首次会比较慢。
