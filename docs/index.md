---
layout: home

hero:
  name: Liny
  text: 写代码，也写生活
  tagline: 这里是我的个人博客。用 Markdown 记录技术与日常，用 Git 管理每一次修改，托管在 GitHub Pages 上，零成本长期运行。
  image:
    src: /logo.svg
    alt: Liny
  actions:
    - theme: brand
      text: 开始阅读
      link: /notes/
    - theme: alt
      text: 关于这个博客
      link: /about

features:
  - icon: 📝
    title: 技术笔记
    details: 语言、工具、部署与踩坑记录。写给自己，也希望能帮到恰好路过的你。
    link: /notes/
    linkText: 浏览笔记
  - icon: 🌿
    title: 生活随笔
    details: 读书、散步、缓慢生长的日常。没有干货，只有一些真实的想法。
    link: /essays/
    linkText: 阅读随笔
  - icon: ⚡
    title: 零成本运行
    details: 静态生成 + GitHub Actions 自动部署，一年只需要为可选的域名付费。
    link: /about
    linkText: 了解方案
---

<LatestPosts :limit="6" />

> 本博客的所有源码都在 [GitHub 仓库](https://github.com/yqlg/blog) 里，欢迎 star、提 issue，或者直接 fork 一份做你自己的博客。
