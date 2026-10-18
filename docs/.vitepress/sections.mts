/**
 * 站点的内容栏目。改这里的 label，导航、侧边栏、列表、徽标会一起变。
 */
export const SECTIONS = {
  notes: { label: '技术小站', short: '技术', path: '/notes/' },
  essays: { label: '动态', short: '动态', path: '/essays/' }
} as const

export type Section = keyof typeof SECTIONS

export const SECTION_KEYS = Object.keys(SECTIONS) as Section[]
