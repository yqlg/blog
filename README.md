# Liny · 个人博客

> 一个用 Markdown 写作、用 Git 管理、由 GitHub Actions 自动发布的博客。
> 除了可选的域名，一年花费 **￥0**。

- 线上地址（GitHub Pages）：<https://yqlg.github.io/blog/>
- 备用镜像（Cloudflare Pages）：`https://<你的项目名>.pages.dev`（部署后填入）
- 仓库：<https://github.com/yqlg/blog>

---

## 一、方案总览

```text
        ┌───────────────┐        git push        ┌──────────────────┐
        │  本地 Markdown │ ────────────────────▶ │    GitHub 仓库    │
        │  docs/**/*.md  │                       │  （版本管理+备份） │
        └───────────────┘                       └────────┬─────────┘
                                                         │ 触发
                                                         ▼
                                              ┌────────────────────┐
                                              │  GitHub Actions     │
                                              │  npm ci && build    │
                                              └─────────┬──────────┘
                                                        │ 产物 docs/.vitepress/dist
                                    ┌───────────────────┴────────────────────┐
                                    ▼                                        ▼
                        ┌────────────────────┐                   ┌────────────────────┐
                        │  GitHub Pages      │                   │  Cloudflare Pages  │
                        │  主站（免费 CDN）   │                   │  镜像（免费 CDN）   │
                        └────────────────────┘                   └────────────────────┘
```

### 成本

| 项目 | 选型 | 费用 |
| --- | --- | --- |
| 写作与构建 | VitePress（静态站点生成器） | ￥0 |
| 代码托管 / 版本管理 | GitHub 公开仓库 | ￥0 |
| 持续集成与部署 | GitHub Actions | ￥0（公开仓库不计分钟数） |
| 网站托管 | GitHub Pages | ￥0（1 GB 站点 / 100 GB 月流量） |
| 备用镜像 | Cloudflare Pages | ￥0（每月 500 次构建，请求不限） |
| HTTPS 证书 | 两家都自动签发 | ￥0 |
| 搜索 / RSS / 统计 | 本地全文搜索 + 内置 RSS + CF Web Analytics | ￥0 |
| 评论 | giscus（基于 GitHub Discussions） | ￥0 |
| **域名（可选）** | `yqlg.github.io` / `*.pages.dev` 免费；自购 `.com` 约 ￥60–90/年 | **￥0 起** |

结论：**不买域名 = 完全 0 成本；买域名 = 一年一杯咖啡的钱。**

> 当前状态：**暂不购买域名**，主站使用 <https://yqlg.github.io/blog/>，等站点内容稳定后再考虑域名。买域名时按 [6.2](#_6-2-自定义域名-唯一的可选花费) 操作即可，只需改两处。

### 额度用完了吗？

不会。个人博客每月构建十几次、访问量几千，离任何一家平台的免费上限都差着两三个数量级。真正会先到上限的是你的写作热情，而不是额度。

---

## 二、技术选型

**VitePress**：Vue 生态的静态站点生成器，本质是「Markdown 进、静态 HTML 出」。

选它的理由：

- 配置极少，一个 `config.mts` 就能跑起来，没有插件地狱；
- 产物轻，首屏没有多余 JS，手机打开也快；
- 自带本地全文搜索（本项目已针对中文重新分词）、深色模式、代码高亮、侧边栏、SEO 元信息；
- 内容就是文件，没有数据库。十年后 `git clone` 下来照样能构建。

对比 Hexo / Hugo / Astro：功能都能做到，VitePress 的取舍是「用最少的配置换最快的上手」，代价是博客感需要自己补一点（本项目已经补好：首页文章流、标签、归档、阅读列表）。

---

## 三、目录结构

```text
blog/
├─ docs/                          # 站点源码（VitePress 的 srcDir）
│  ├─ .vitepress/
│  │  ├─ config.mts               # 站点配置：导航、侧边栏、搜索、SEO
│  │  ├─ site.mts                 # ★ 个人信息 / 联系方式 / giscus / 统计的集中配置
│  │  ├─ posts.data.mts           # 构建期收集全部文章（首页/标签/归档共用）
│  │  ├─ sidebar.mts              # 按文件系统自动生成侧边栏
│  │  ├─ feed.mts                 # 构建结束后生成 /feed.xml
│  │  ├─ utils.mts                # frontmatter 解析、文章扫描
│  │  └─ theme/                   # 自定义主题
│  │     ├─ index.ts
│  │     ├─ Layout.vue            # 文章头 + 评论区的插槽
│  │     ├─ components/           # LatestPosts / PostList / TagList / HomeContact / Giscus / PostHeader
│  │     └─ styles/custom.css     # 配色与排版
│  ├─ public/                     # 原样复制的静态资源
│  │  ├─ logo.svg                 # 站点标记（导航、首页）
│  │  ├─ favicon.svg              # 浏览器图标
│  │  ├─ avatar.png               # 512×512，Apple touch icon / 社交头像
│  │  ├─ og.png                   # 1200×630 分享卡片
│  │  └─ images/                  # 文章配图（放进来自动复制到 /images/）
│  ├─ notes/                      # 技术笔记（每篇一个 .md）
│  ├─ essays/                     # 生活随笔
│  ├─ index.md                    # 首页
│  ├─ about.md                    # 关于
│  ├─ tags.md                     # 标签页
│  └─ archive.md                  # 归档页
├─ scripts/new-post.mjs           # 一条命令新建文章
├─ scripts/gen-og.py              # 重新生成 avatar.png / og.png
├─ .github/workflows/deploy.yml   # push 即部署
├─ package.json
└─ README.md
```

### 改站点信息只改一个文件

`docs/.vitepress/site.mts` 是唯一的信息源：站名、简介、邮箱、GitHub、QQ、giscus 参数、统计 token 都在里面。改完之后全站（首页联系区、关于页数据源、SEO、评论、统计）一起生效。

> 关于页 `docs/about.md` 里的联系方式是直接写在 Markdown 里的，改的时候两处一起改（或把它也换成 `<HomeContact />`）。

**内容与展示是分开的**：新增文章只需要往 `docs/notes` 或 `docs/essays` 里丢一个 `.md`，首页「最新文章」、栏目列表、侧边栏、标签、归档、RSS 全部自动更新，不需要改任何列表或配置。

---

## 四、本地开发

环境要求：Node.js ≥ 18（推荐 20 / 22）。

```bash
npm install     # 首次
npm run dev     # http://localhost:5173/ 热更新的本地预览
npm run build   # 构建到 docs/.vitepress/dist
npm run preview # 预览构建产物，上线前自检用
```

> 本地默认 `BASE=/`，线上 GitHub Pages 构建时由 workflow 注入 `BASE=/blog/`，所以不要手动改代码里的 base。

---

## 五、写一篇文章

### 方式一：命令行（推荐）

```bash
npm run new -- "用 VitePress 搭一个零成本博客" --section notes --tags 建站,VitePress
```

会在 `docs/notes/2026-10-18-post.md` 生成带 frontmatter 的模板。

参数：

| 参数 | 说明 |
| --- | --- |
| `--section` | `notes`（技术笔记）或 `essays`（生活随笔），默认 `notes` |
| `--slug` | 英文短横线文件名，推荐显式指定；中文标题不传时会退化成 `post` |
| `--tags` | 逗号分隔，例如 `--tags 建站,部署` |

### 方式二：手动新建

在 `docs/notes/` 或 `docs/essays/` 下创建 `YYYY-MM-DD-slug.md`，开头写：

```markdown
---
title: 文章标题
date: 2026-10-18
tags: [建站, VitePress]
description: 一句话摘要，会出现在列表、搜索结果和 RSS 里。
---

正文……
```

- `title` 与 `date` 必填；**没有 `date` 的文章不会出现在首页、归档和侧边栏**，可以当草稿用。
- 文件名决定 URL：`docs/notes/2026-10-18-foo.md` → `/notes/2026-10-18-foo.html`。用英文、数字和短横线，别用空格。
- 内部链接写相对路径：`[上一篇](./2026-10-02-github-actions-deploy)`。
- 图片放 `docs/public/images/`，引用 `/images/xxx.png`。

### 发布

```bash
git add .
git commit -m "post: 用 VitePress 搭一个零成本博客"
git push
```

推送后约 1 分钟，Actions 变绿即上线。提交信息建议用 `post:` / `fix:` / `chore:` 前缀，方便日后回看。

---

## 六、部署

### 6.1 GitHub Pages（主站）

**一次性设置：**

1. 在 GitHub 新建仓库 `yqlg/blog`（**必须是 public**，私有仓库的 Pages 需要付费的 GitHub Pro）。
2. 本地关联并推送：

   ```bash
   git remote add origin https://github.com/yqlg/blog.git
   git branch -M main
   git push -u origin main
   ```

3. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
4. 等到 Actions 里的 `Deploy Blog to GitHub Pages` 跑完，访问 <https://yqlg.github.io/blog/>。

之后每次 `git push` 到 `main` 都会自动重新构建。也可以在 Actions 页面手动 `Run workflow`。

**为什么 base 是 `/blog/`？** 项目站点的地址是 `https://<用户名>.github.io/<仓库名>/`，静态资源的路径必须带上仓库名。workflow 里已经写死：

```yaml
env:
  BASE: /blog/
  SITE_URL: https://yqlg.github.io
```

如果以后把仓库改名，记得同步这两行。

### 6.2 自定义域名（唯一的可选花费）

| 选择 | 首年 | 续费 | 说明 |
| --- | --- | --- | --- |
| 不买，用 `yqlg.github.io/blog` | ￥0 | ￥0 | 最省事，国内访问可能偏慢 |
| `.com`（Cloudflare Registrar / 阿里云 / 腾讯云） | ￥55–90 | ￥70–100 | 通用、好记，推荐 |
| `.me` / `.dev` / `.im` | ￥80–150 | 类似 | 有个性，`.dev` 强制 HTTPS |
| `eu.org` 等免费二级域名 | ￥0 | ￥0 | 审核慢、稳定性一般，不推荐长期用 |

接入步骤：

1. 在域名商处添加解析：
   - `A` 记录 `@` → `185.199.108.153`、`185.199.109.153`、`185.199.110.153`、`185.199.111.153`
   - `CNAME` 记录 `www` → `yqlg.github.io`
2. 仓库根目录新建 `CNAME` 文件，内容为裸域名（如 `liny.me`）。
3. 仓库 **Settings → Pages** 填入 Custom domain，等待 DNS 检查通过，勾选 **Enforce HTTPS**。
4. 修改 `.github/workflows/deploy.yml`：`BASE: /`，`SITE_URL: https://liny.me`。
5. 推送一次，确认资源路径从 `/blog/assets/...` 变成 `/assets/...`。

> 备案提醒：托管在 GitHub Pages、Cloudflare Pages 这类境外平台，**不需要 ICP 备案**；但如果你之后把域名指向国内 CDN（如腾讯云 EdgeOne、阿里云 CDN）做加速，就会要求备案。

### 6.3 Cloudflare Pages（备用镜像，免费）

同一个仓库，两份构建，互不影响：

1. 打开 Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**，授权并选择 `yqlg/blog`。
2. 构建设置：
   - Framework preset：`None`
   - Build command：`npm run build`
   - Build output directory：`docs/.vitepress/dist`
   - 环境变量：`BASE=/`、`SITE_URL=https://<项目名>.pages.dev`、`CANONICAL_URL=https://yqlg.github.io/blog/`、`NODE_VERSION=22`
3. 保存并部署，得到 `https://<项目名>.pages.dev`。
4. 把镜像地址填到本文件顶部，并在 GitHub 版页面里注明「主站 / 镜像」。

`CANONICAL_URL` 会让镜像页面的 canonical 指向主站，避免两个域名互相抢占搜索排名。

> 提示：Cloudflare Pages 每次 push 也会构建一次，属于免费额度内的正常消耗；不想每次双构建的话，可以在 CF 里把 Production branch 设为不自动构建，需要时手动触发。

### 6.4 部署自检清单

- [ ] 首页、一篇笔记、一篇随笔都能打开
- [ ] 图片与样式正常（样式丢失 = `BASE` 写错）
- [ ] 搜索框输入「部署」有结果（中文分词生效）
- [ ] `/feed.xml` 能打开，RSS 阅读器能订阅
- [ ] 手机宽度下导航和卡片不溢出
- [ ] 深色模式切换正常
- [ ] 文末出现评论区（需先填 giscus ID）
- [ ] Cloudflare 面板能看到访问记录（需先填统计 token）

---

## 七、国内访问与加速（可选）

`github.io` 在国内时快时慢，属于正常现象。按成本从低到高：

1. **双托管**（本方案已内置）：CF Pages 镜像做备用，主站打不开时换镜像。
2. **Cloudflare 代理**：给自定义域名套 CF 的免费 CDN，缓存静态资源。注意 CF 免费节点在国内同样可能不稳定。
3. **图片外链**：图片放仓库，用 jsDelivr（`https://cdn.jsdelivr.net/gh/yqlg/blog@main/docs/public/images/x.png`）加速；或干脆用 WebP + 压缩。
4. **国内对象存储 + CDN**：稳定但要钱，且需备案，不符合「0 成本」目标，仅作了解。

---

## 八、评论与统计（已接好，填 ID 即生效）

两者的代码都已经写好，只差一个属于你的标识。都免费，各花两三分钟。

### 8.1 评论：giscus

原理：每篇文章的评论存成 GitHub Discussions 里的一个讨论串，读者用 GitHub 账号登录后发言。不花钱、无广告、数据在你自己的仓库里。

1. 仓库 **Settings → General → Features** 勾选 **Discussions**。
2. 安装 giscus App：<https://github.com/apps/giscus>，只授权 `yqlg/blog` 这一个仓库。
3. 打开 <https://giscus.app/zh-CN>，「仓库」填 `yqlg/blog`，Discussion 分类选 `Announcements`（或新建一个 `Comments`），页面会生成一段 script。
4. 从那段 script 里复制两个值：

   ```html
   data-repo-id="R_kgDOxxxxxx"
   data-category-id="DIC_kwDOxxxxxx"
   ```

5. 填进 `docs/.vitepress/site.mts` 的 `giscus.repoId` / `giscus.categoryId`，提交推送。

没填之前评论区不会渲染（本地 `npm run dev` 会显示一条提示），线上不会出现空白块或报错。

### 8.2 统计：Cloudflare Web Analytics

免费、无 Cookie、不采集个人信息，所以不需要同意弹窗。

1. 登录 Cloudflare → 左侧 **Analytics & Logs → Web Analytics**。
2. **Add a site**，填 `yqlg.github.io`（不需要把域名托管到 Cloudflare）。
3. 复制生成的 token（形如 `a1b2c3…`）。
4. 填进 `docs/.vitepress/site.mts` 的 `analytics.cloudflareToken`；也可以在 CI 里用环境变量 `CF_ANALYTICS_TOKEN` 覆盖。
5. 推送后在面板里看访问量、来源和页面排行（数据有几分钟延迟）。

留空则完全不注入脚本，页面没有任何第三方请求。

### 8.3 其它可选增强

| 需求 | 免费方案 | 说明 |
| --- | --- | --- |
| 图片压缩 | Squoosh（在线）/ Pillow | 上传前压一下，WebP 优先 |
| 站点地图 | 已内置 | 构建后自动生成 `sitemap.xml` |
| RSS | 已内置 | `/feed.xml` |
| 自动检查死链 | GitHub Actions 加一步 `lychee` | 可选 |

---

## 九、常见问题

**页面 404 / 只有首页能打开？**
Pages 的 Source 必须是 **GitHub Actions**；仓库名与 `BASE` 必须一致。

**页面没样式、控制台一堆 404？**
`BASE` 缺少结尾斜杠，或写成了完整 URL。正确写法：`/blog/`。

**搜索搜不到中文？**
已用 `Intl.Segmenter` 重新分词。若仍无效，检查浏览器是否支持（Chrome 87+ / Safari 14.1+ 都支持）。

**私有仓库能免费用 Pages 吗？**
不能，需要 GitHub Pro。把仓库设为 public 即可。

**`npm ci` 报错找不到 lockfile？**
把 `package-lock.json` 一并提交。首次 `npm install` 后就会生成。

**以后想换主题 / 换生成器？**
内容全是 Markdown，换掉 `docs/.vitepress` 即可，文章一个字都不用动。

---

## 十、已知占位内容（请替换）

- `docs/notes/`、`docs/essays/` 下 6 篇文章是**示例**，用于展示排版效果，可直接删除或改写。
- `docs/about.md` 的自我介绍是通用文案，联系方式已按实际信息填写。
- `docs/.vitepress/site.mts` 里的 giscus `repoId` / `categoryId` 与统计 token 还是空的，按第八节填写。
- 头像与分享图是脚本生成的：`python scripts/gen-og.py` 可重新生成 `avatar.png` / `og.png`；想换成自己的照片，直接替换 `docs/public/avatar.png` 与 `logo.svg` 即可。
- 全站的 GitHub 链接指向 `https://github.com/yqlg`，如需修改请全局搜索 `yqlg`。

## 授权

- 代码：MIT
- 文章：CC BY-NC-SA 4.0
