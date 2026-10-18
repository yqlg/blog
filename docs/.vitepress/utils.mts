import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))

/** 文档根目录（docs/） */
export const docsDir = path.resolve(here, '..')

export type Section = 'notes' | 'essays'

export interface PostMeta {
  title: string
  /** 站内绝对路径，不含 base，例如 /notes/hello.html */
  url: string
  /** YYYY-MM-DD */
  date: string
  tags: string[]
  description: string
  section: Section
  minutes: number
  /** 相对 docs/ 的文件路径，用于编辑链接与调试 */
  file: string
}

const SECTION_DIRS: Section[] = ['notes', 'essays']

function unquote(value: string): string {
  return value
    .trim()
    .replace(/^(['"])([\s\S]*)\1$/, '$2')
    .trim()
}

/**
 * 极简 frontmatter 解析：只支持博客用到的标量、行内数组和 `- item` 列表。
 * 不引入额外依赖，保证配置阶段零成本、零依赖。
 */
export function parseFrontmatter(source: string): Record<string, string | string[] | boolean | number> {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source)
  if (!match) return {}

  const data: Record<string, string | string[] | boolean | number> = {}
  let list: string[] | null = null

  for (const rawLine of match[1].split(/\r?\n/)) {
    const line = rawLine.replace(/\s+$/, '')
    if (!line.trim() || line.trimStart().startsWith('#')) continue

    const listItem = /^\s*-\s+(.+)$/.exec(line)
    if (listItem && list) {
      list.push(unquote(listItem[1]))
      continue
    }

    const kv = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line)
    if (!kv) continue

    const key = kv[1]
    const raw = kv[2].trim()

    if (raw === '') {
      list = []
      data[key] = list
      continue
    }

    list = null
    const inline = /^\[(.*)\]$/.exec(raw)
    if (inline) {
      data[key] = inline[1]
        .split(',')
        .map((item) => unquote(item))
        .filter(Boolean)
      continue
    }

    if (raw === 'true' || raw === 'false') {
      data[key] = raw === 'true'
      continue
    }

    data[key] = /^-?\d+(\.\d+)?$/.test(raw) ? Number(raw) : unquote(raw)
  }

  return data
}

/** 粗略估算中文阅读时长（按每分钟 400 字） */
function estimateMinutes(source: string): number {
  const body = source.replace(/^---[\s\S]*?---/, '')
  const chars = body
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[\s#>*_`\-|]/g, '').length
  return Math.max(1, Math.round(chars / 400))
}

function walk(dir: string, files: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'index.md') files.push(full)
  }
  return files
}

/** 扫描 docs/notes 与 docs/essays 下所有文章，按日期倒序返回 */
export function scanPosts(): PostMeta[] {
  const posts: PostMeta[] = []

  for (const section of SECTION_DIRS) {
    const dir = path.join(docsDir, section)
    if (!fs.existsSync(dir)) continue

    for (const file of walk(dir)) {
      const source = fs.readFileSync(file, 'utf8')
      const fm = parseFrontmatter(source)
      if (!fm.title || !fm.date) continue

      const rel = path.relative(docsDir, file).split(path.sep).join('/')
      const tags = Array.isArray(fm.tags) ? fm.tags : fm.tags ? [String(fm.tags)] : []

      posts.push({
        title: String(fm.title),
        url: `/${rel.replace(/\.md$/, '.html')}`,
        date: String(fm.date).slice(0, 10),
        tags: tags.map(String),
        description: String(fm.description ?? ''),
        section,
        minutes: estimateMinutes(source),
        file: rel
      })
    }
  }

  return posts.sort((a, b) => {
    if (a.date === b.date) return a.title.localeCompare(b.title, 'zh-CN')
    return a.date < b.date ? 1 : -1
  })
}

/** 按年份分组，年份倒序 */
export function groupByYear<T extends { date: string }>(items: T[]): Array<[string, T[]]> {
  const map = new Map<string, T[]>()
  for (const item of items) {
    const year = item.date.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(item)
  }
  return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))
}
