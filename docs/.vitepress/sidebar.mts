import { scanPosts, groupByYear, type PostMeta } from './utils.mts'
import { SECTIONS, SECTION_KEYS, type Section } from './sections.mts'

/**
 * 侧边栏由文件系统自动生成：新增一篇带 date 的 .md 就会自动出现在侧边栏，
 * 不需要手动维护任何列表。
 */
export function buildSidebar() {
  const posts = scanPosts()
  const sidebar: Record<string, unknown[]> = {}

  for (const section of SECTION_KEYS) {
    const items = posts.filter((post) => post.section === section)
    const years = groupByYear(items)

    sidebar[SECTIONS[section].path] = [
      {
        text: SECTIONS[section].label,
        items: [
          { text: '全部文章', link: SECTIONS[section].path },
          { text: '按年份归档', link: '/archive' }
        ]
      },
      ...years.map(([year, list], index) => ({
        text: `${year} 年 · ${list.length} 篇`,
        collapsed: index > 0,
        items: list.map((post: PostMeta) => ({ text: post.title, link: post.url }))
      }))
    ]
  }

  return sidebar
}

export type { Section }
