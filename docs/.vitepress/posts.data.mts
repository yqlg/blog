import { createContentLoader } from 'vitepress'
import type { Section } from './sections.mts'

export interface Post {
  title: string
  url: string
  date: string
  tags: string[]
  description: string
  section: Section
}

declare const data: Post[]
export { data }

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  const text = String(value ?? '')
  const match = /^\d{4}-\d{2}-\d{2}/.exec(text)
  return match ? match[0] : ''
}

/**
 * 构建期收集全部文章（只认带 date 的 .md），首页、列表页、标签页共用同一份数据。
 */
export default createContentLoader(['notes/**/*.md', 'essays/**/*.md'], {
  transform(raw): Post[] {
    return raw
      .filter((page) => page.frontmatter?.date && page.frontmatter?.title)
      .filter((page) => !page.url.endsWith('/') )
      .map((page) => {
        const tags = page.frontmatter.tags
        const section = page.url.split('/')[1] as Section
        return {
          title: String(page.frontmatter.title),
          url: page.url,
          date: toDateString(page.frontmatter.date),
          tags: Array.isArray(tags) ? tags.map(String) : tags ? [String(tags)] : [],
          description: String(page.frontmatter.description ?? ''),
          section
        }
      })
      .filter((post) => post.date)
      .sort((a, b) => (a.date === b.date ? a.title.localeCompare(b.title, 'zh-CN') : a.date < b.date ? 1 : -1))
  }
})
