---
layout: home
titleTemplate: false

hero:
  name: Liny
  text: 写代码，也写生活
  tagline: 这里是我的个人博客。用 Markdown 记录技术与日常，用 Git 管理每一次修改，托管在 GitHub Pages 上，零成本长期运行。
  actions:
    - theme: brand
      text: 开始阅读
      link: /notes/
    - theme: alt
      text: 关于我
      link: /about

features:
  - icon: 📝
    title: 技术小站
    details: 语言、工具、部署与踩坑记录。写给自己，也希望能帮到恰好路过的你。
    link: /notes/
    linkText: 进入小站
  - icon: 🌿
    title: 动态
    details: 最近在做什么、读了什么、想到什么。短一点，随意一点。
    link: /essays/
    linkText: 看看动态
---

<NowDoing />

<LatestPosts section="essays" :limit="3" title="最近动态" more-text="全部动态" more-link="/essays/" />
