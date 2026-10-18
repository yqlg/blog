---
title: 我在这台博客上的 Markdown 约定
date: 2026-10-15
tags: [Markdown, 写作, VitePress]
description: 文件怎么命名、frontmatter 写哪些字段、代码块和提示框怎么用——一份写给未来的自己的备忘。
---

## 一篇文章的最小结构

```markdown
---
title: 文章标题
date: 2026-10-15
tags: [Markdown, 写作]
description: 一句话摘要，会出现在列表页、搜索结果和 RSS 里。
---

正文从这里开始。
```

只有 `title` 和 `date` 是必需的。缺失 `date` 的文章不会进入首页、归档和侧边栏——这个设计顺便让草稿可以安静地待在仓库里。

写摘要值得多花三十秒。列表、搜索结果、RSS 阅读器、分享卡片都只靠这一句，它决定了别人会不会点进来。

## 文件命名

```text
docs/notes/2026-10-15-markdown-conventions.md
          └─ 栏目  └─ 日期    └─ 语义化文件名
```

日期前缀让文件夹按时间自然排序，也避免了「新建文章.md」这类名字。真正决定线上 URL 的是文件名，所以别用中文和空格。

## 代码块要写文件名

有了标题栏，读者一眼就知道这段代码该放哪：

````markdown
```ts title="docs/.vitepress/config.mts"
const base = process.env.BASE || '/'
```
````

长代码记得折叠：

```md
::: details 展开看完整配置
（内容）
:::
```

## 提示框的四种颜色

::: tip 建议
绿色，用于经验、技巧、更好的做法。
:::

::: info 说明
蓝色，用于补充背景，不读也不影响理解。
:::

::: warning 注意
黄色，用于容易出错但后果可控的地方。
:::

::: danger 危险
红色，用于会丢数据、会花钱、会不可逆的操作。
:::

四种颜色不要都用在同一篇里，否则读者会失去对颜色的敏感度。

## 内部链接写成相对路径

```markdown
[上一篇](./2026-09-18-build-blog-with-vitepress)
[跨栏目](../essays/2026-08-24-why-i-still-blog)
```

VitePress 会在构建时把 `.md` 路径转换成最终 URL，并检查目标是否存在。写成硬编码的 `.html` 反而会在将来改版时全部失效。

## 图片放进 public

```text
docs/public/images/2026/desk.jpg   →   /images/2026/desk.jpg
```

`public` 里的文件会原样复制到站点根目录，不参与构建，所以路径是稳定的。给图片加上 alt 文字，深色模式下也记得看一眼对比度。

## 发布

```bash
git add docs/notes/2026-10-15-markdown-conventions.md
git commit -m "post: Markdown 写作约定"
git push
```

推送之后 Actions 会自动构建。提交信息我习惯用 `post:` / `fix:` / `chore:` 开头，翻历史记录时能一眼看出这次改动是内容还是配置。

---

写作这件事，工具越顺手，动笔的概率越高。以上约定没有一条是必须的，它们只是让我少做几次无谓的选择。
