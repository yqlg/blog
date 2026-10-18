import { scanPosts, groupByYear, type PostMeta } from './utils.mts'

const SECTION_LABEL = {
  notes: '技术笔记',
  essays: '生活随笔'
} as const

/**
 * 侧边栏由文件系统自动生成：新增一篇带 date 的 .md 就会自动出现在侧边栏，
 * 不需要手动维护任何列表。
 */
export function buildSidebar() {
  const posts = scanPosts()
  const sidebar: Record<string, unknown[]> = {}

  for (const section of ['notes', 'essays'] as const) {
    const items = posts.filter((post) => post.section === section)
    const years = groupByYear(items)

    sidebar[`/${section}/`] = [
      {
        text: SECTION_LABEL[section],
        items: [
          { text: '全部文章', link: `/${section}/` },
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
