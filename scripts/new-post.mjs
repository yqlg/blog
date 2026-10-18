#!/usr/bin/env node
/**
 * 新建一篇文章：
 *   npm run new -- "文章的标题" --section notes --tags 建站,部署
 *   npm run new -- "A Slow Morning" --section essays --slug a-slow-morning
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)

function takeFlag(name) {
  const index = args.findIndex((arg) => arg === `--${name}` || arg.startsWith(`--${name}=`))
  if (index === -1) return undefined
  const [flag, inline] = args[index].split('=')
  if (inline !== undefined) {
    args.splice(index, 1)
    return inline
  }
  const value = args[index + 1]
  args.splice(index, 2)
  return value
}

const section = takeFlag('section') ?? 'notes'
const slugFlag = takeFlag('slug')
const tagsFlag = takeFlag('tags')
const title = args.join(' ').trim()

if (!title) {
  console.error('用法: npm run new -- "文章标题" [--section notes|essays] [--slug english-slug] [--tags a,b]')
  process.exit(1)
}

if (!['notes', 'essays'].includes(section)) {
  console.error(`未知栏目: ${section}（只支持 notes 或 essays）`)
  process.exit(1)
}

const today = new Date().toLocaleDateString('sv-SE') // YYYY-MM-DD，按本地时区
const slug =
  (slugFlag ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'post'

const dir = path.join(root, 'docs', section)
fs.mkdirSync(dir, { recursive: true })

let fileName = `${today}-${slug}.md`
let counter = 2
while (fs.existsSync(path.join(dir, fileName))) {
  fileName = `${today}-${slug}-${counter}.md`
  counter += 1
}

const tags = (tagsFlag ?? '')
  .split(',')
  .map((tag) => tag.trim())
  .filter(Boolean)

const content = `---
title: ${title}
date: ${today}
tags: [${tags.join(', ')}]
description: 一句话摘要，会出现在首页列表、搜索结果和 RSS 里。
---

在这里开始写。写完执行：

\`\`\`bash
git add . && git commit -m "post: ${title}" && git push
\`\`\`
`

const target = path.join(dir, fileName)
fs.writeFileSync(target, content, 'utf8')

console.log(`\n✓ 已创建 ${path.relative(root, target)}`)
console.log(`  本地预览: npm run dev\n`)
