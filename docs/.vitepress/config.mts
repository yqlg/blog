import { defineConfig, type HeadConfig } from 'vitepress'
import { site } from './site.mts'
import { buildSidebar } from './sidebar.mts'
import { feedPlugin } from './feed.mts'

/**
 * 部署相关环境变量：
 *   BASE     站点的发布子路径。GitHub Pages 项目站点是 /blog/，
 *            自定义域名或 Cloudflare Pages 根路径时设为 /（默认）。
 *   SITE_URL 站点主域名，用于 sitemap 与 RSS 里的绝对链接。
 *   CF_ANALYTICS_TOKEN 可选，覆盖 site.mts 里的统计 token。
 */
const base = process.env.BASE || '/'
const siteUrl = (process.env.SITE_URL || site.url).replace(/\/+$/, '')
/** 主站地址：镜像站（如 Cloudflare Pages）用它做 canonical，避免重复收录 */
const canonicalBase = (process.env.CANONICAL_URL || `${siteUrl}${base}`).replace(/\/+$/, '')

const TITLE = site.name
const DESCRIPTION = site.description
const analyticsToken = process.env.CF_ANALYTICS_TOKEN || site.analytics.cloudflareToken

const head: HeadConfig[] = [
  ['link', { rel: 'icon', type: 'image/svg+xml', href: `${base}favicon.svg` }],
  ['link', { rel: 'apple-touch-icon', href: `${base}avatar.png` }],
  ['link', { rel: 'alternate', type: 'application/rss+xml', title: `${TITLE} · RSS`, href: `${base}feed.xml` }],
  ['meta', { name: 'theme-color', content: '#2f7a63' }],
  ['meta', { name: 'author', content: site.author.name }],
  ['meta', { property: 'og:type', content: 'website' }],
  ['meta', { property: 'og:site_name', content: TITLE }],
  ['meta', { property: 'og:image', content: `${siteUrl}${base}og.png` }],
  ['meta', { property: 'og:image:width', content: '1200' }],
  ['meta', { property: 'og:image:height', content: '630' }],
  ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
  ['meta', { name: 'format-detection', content: 'telephone=no' }]
]

// 首屏渲染前先按「本地时间 + 上次选择」定主题，避免白天/黑夜切换时闪一下
head.push([
  'script',
  {},
  `(function(){try{var m=localStorage.getItem('liny-color-mode')||'auto';var h=new Date().getHours();var d=m==='dark'||(m==='auto'&&(h<6||h>=18));var r=document.documentElement;if(d){r.classList.add('dark')}r.style.colorScheme=d?'dark':'light'}catch(e){}})()`
])

// Cloudflare Web Analytics：免费、无 Cookie，不需要同意弹窗
if (analyticsToken) {
  head.push([
    'script',
    {
      defer: 'true',
      src: 'https://static.cloudflareinsights.com/beacon.min.js',
      'data-cf-beacon': JSON.stringify({ token: analyticsToken })
    }
  ])
}

export default defineConfig({
  lang: 'zh-CN',
  title: TITLE,
  titleTemplate: `:title · ${TITLE}`,
  description: DESCRIPTION,
  base,
  // 主题由 theme/mode.ts 接管：按时间自动切换 + 手动覆盖
  appearance: false,
  lastUpdated: true,
  cleanUrls: false,
  ignoreDeadLinks: false,

  head,

  sitemap: {
    hostname: `${siteUrl}${base}`
  },

  transformHead({ pageData }) {
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '.html')
    const href = `${canonicalBase}/${path}`
    const pageTitle = pageData.title && pageData.title !== TITLE ? `${pageData.title} · ${TITLE}` : TITLE
    const pageDesc = pageData.description || DESCRIPTION

    return [
      ['link', { rel: 'canonical', href }],
      ['meta', { property: 'og:title', content: pageTitle }],
      ['meta', { property: 'og:description', content: pageDesc }],
      ['meta', { property: 'og:url', content: href }]
    ]
  },

  markdown: {
    image: { lazyLoading: true },
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '警告',
      infoLabel: '说明',
      detailsLabel: '展开查看'
    }
  },

  themeConfig: {
    siteTitle: TITLE,

    nav: [
      { text: '技术小站', link: '/notes/', activeMatch: '^/notes/' },
      { text: '动态', link: '/essays/', activeMatch: '^/essays/' },
      { text: '关于', link: '/about', activeMatch: '^/about' }
    ],

    sidebar: buildSidebar(),

    socialLinks: [{ icon: 'github', link: 'https://github.com/yqlg' }],

    outline: { level: [2, 3], label: '本页目录' },

    lastUpdated: {
      text: '最后更新于',
      formatOptions: { dateStyle: 'medium', timeStyle: 'short' }
    },

    docFooter: { prev: '上一篇', next: '下一篇' },
    darkModeSwitchLabel: '主题',
    lightModeSwitchTitle: '切换到浅色模式',
    darkModeSwitchTitle: '切换到深色模式',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
    langMenuLabel: '切换语言',

    // 「在 GitHub 上编辑此页」入口已关闭
    editLink: false,

    // 页脚只放图标（GitHub / 邮件 / QQ / RSS），不再渲染默认文字页脚
    // 具体实现在 theme/components/SiteFooter.vue

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索文章', buttonAriaLabel: '搜索文章' },
          modal: {
            noResultsText: '没有找到相关结果',
            resetButtonTitle: '清除查询条件',
            footer: {
              selectText: '选择',
              navigateText: '切换',
              closeText: '关闭'
            }
          }
        },
        miniSearch: {
          options: {
            // 中文没有空格分词，用 Intl.Segmenter 按词切分，检索才不会退化
            tokenize: (text: string) => {
              const segmenter = new Intl.Segmenter('zh', { granularity: 'word' })
              return Array.from(segmenter.segment(text))
                .filter((part) => part.isWordLike)
                .map((part) => part.segment)
            },
            processTerm: (term: string) => term.toLowerCase()
          },
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            boost: { title: 4, text: 2, titles: 1 }
          }
        }
      }
    }
  },

  vite: {
    plugins: [feedPlugin({ siteUrl, base, title: TITLE, description: DESCRIPTION, author: 'Liny' })]
  }
})
