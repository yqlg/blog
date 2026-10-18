import fs from 'node:fs'
import path from 'node:path'
import { docsDir, scanPosts } from './utils.mts'

interface FeedOptions {
  siteUrl: string
  base: string
  title: string
  description: string
  author: string
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** 生成 RSS 2.0，放在 dist/feed.xml，供 RSS 阅读器订阅 */
let written = false

function writeFeed(options: FeedOptions) {
  if (written) return
  written = true
  const posts = scanPosts().slice(0, 30)
  const root = `${options.siteUrl.replace(/\/+$/, '')}${options.base}`.replace(/\/+$/, '')
  const self = `${root}/feed.xml`
  const now = new Date().toUTCString()

  const items = posts
    .map((post) => {
      const link = `${root}${post.url}`
      const pubDate = new Date(`${post.date}T08:00:00+08:00`).toUTCString()
      return [
        '    <item>',
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${escapeXml(link)}</link>`,
        `      <guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(post.description || post.title)}</description>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        '    </item>'
      ].join('\n')
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(options.title)}</title>
    <link>${escapeXml(`${root}/`)}</link>
    <description>${escapeXml(options.description)}</description>
    <language>zh-CN</language>
    <lastBuildDate>${now}</lastBuildDate>
    <atom:link href="${escapeXml(self)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`

  const distDir = path.join(docsDir, '.vitepress', 'dist')
  if (!fs.existsSync(distDir)) return
  fs.writeFileSync(path.join(distDir, 'feed.xml'), xml, 'utf8')
  console.log(`[feed] wrote ${posts.length} items -> dist/feed.xml`)
}

export function feedPlugin(options: FeedOptions) {
  return {
    name: 'liny-rss-feed',
    apply: 'build' as const,
    closeBundle() {
      try {
        writeFeed(options)
      } catch (error) {
        console.warn('[feed] failed to generate feed.xml', error)
      }
    }
  }
}
