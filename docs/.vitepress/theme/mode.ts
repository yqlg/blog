import { computed, ref, watch } from 'vue'

/**
 * 主题模式：
 *   auto  —— 按时间自动切换（18:00–06:00 深色，其余浅色）
 *   light / dark —— 用户手动选择，之后不再随时间变化
 * 选择会记在 localStorage，下次打开沿用。
 */
type Mode = 'auto' | 'light' | 'dark'

const STORAGE_KEY = 'liny-color-mode'
const inBrowser = typeof window !== 'undefined'

function readMode(): Mode {
  if (!inBrowser) return 'auto'
  const value = window.localStorage.getItem(STORAGE_KEY)
  return value === 'light' || value === 'dark' ? value : 'auto'
}

export const mode = ref<Mode>(readMode())

/** 现在是否是"夜间"（18 点后到次日 6 点前） */
export function isNight(date = new Date()): boolean {
  const hour = date.getHours()
  return hour < 6 || hour >= 18
}

const tick = ref(Date.now())

if (inBrowser) {
  // 页面一直开着时，到点自动切换
  window.setInterval(() => (tick.value = Date.now()), 60_000)
}

export const isDark = computed(() => {
  if (mode.value === 'dark') return true
  if (mode.value === 'light') return false
  return isNight(new Date(tick.value))
})

export const modeLabel = computed(() => {
  if (mode.value === 'dark') return '深色'
  if (mode.value === 'light') return '浅色'
  return '自动'
})

function apply(dark: boolean) {
  if (!inBrowser) return
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.style.colorScheme = dark ? 'dark' : 'light'
}

watch(isDark, apply, { immediate: true })

/** 手动切换：浅色 ⇄ 深色（点一次就固定下来） */
export function toggleMode() {
  mode.value = isDark.value ? 'light' : 'dark'
  if (inBrowser) window.localStorage.setItem(STORAGE_KEY, mode.value)
  apply(isDark.value)
}
