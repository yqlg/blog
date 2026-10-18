/**
 * 站点与个人信息的唯一配置源。
 * 页面、组件、SEO 都从这里取值，改一次全站生效。
 */
export const site = {
  name: 'Liny',
  description: 'Liny 的个人博客：记录技术笔记与生活随笔，用最少的成本长期写下去。',
  /** 部署后的主站地址（不含 base），目前使用 GitHub Pages 项目站点 */
  url: 'https://yqlg.github.io',

  author: {
    name: 'Liny',
    email: 'yql314512@163.com',
    github: 'https://github.com/yqlg',
    qq: '1302261075',
    /** 一句话介绍，出现在首页与关于页 */
    bio: '写代码，也写生活。'
  },

  /**
   * 评论：giscus（基于 GitHub Discussions，免费、无广告、无追踪）
   *
   * 启用步骤（约 3 分钟）：
   * 1. 仓库 Settings → General → Features 勾选 Discussions
   * 2. 安装 giscus App：https://github.com/apps/giscus
   * 3. 打开 https://giscus.app/zh-CN ，填入 yqlg/blog，
   *    把页面给出的 data-repo-id 与 data-category-id 填到下面两行
   * 4. 推送即生效；两项为空时评论区不渲染，不会报错
   */
  giscus: {
    repo: 'yqlg/blog',
    repoId: '',
    category: 'Announcements',
    categoryId: '',
    mapping: 'pathname',
    lang: 'zh-CN',
    inputPosition: 'top',
    reactionsEnabled: '1'
  },

  /**
   * 统计：Cloudflare Web Analytics（免费、无 Cookie、不采集个人数据）
   *
   * 启用步骤：Cloudflare Dashboard → Analytics & Logs → Web Analytics →
   * Add a site → 复制 “JS 代码片段” 里的 token（一长串字符），填到下面。
   * 留空则不注入任何统计脚本。
   * 也可以在构建时用环境变量 CF_ANALYTICS_TOKEN 覆盖（推荐用于 CI）。
   */
  analytics: {
    cloudflareToken: ''
  }
} as const
