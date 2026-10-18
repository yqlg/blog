<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { site } from '../../site.mts'

const cfg = site.giscus
const isDev = import.meta.env.DEV

/** repoId / categoryId 未填写时整个评论区不渲染 */
const configured = computed(() => Boolean(cfg.repoId && cfg.categoryId))

function currentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/** 把主题同步给 giscus iframe */
function syncTheme() {
  const frame = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  frame?.contentWindow?.postMessage(
    { giscus: { setConfig: { theme: currentTheme() } } },
    'https://giscus.app'
  )
}

let observer: MutationObserver | undefined

function mount() {
  const container = document.getElementById('giscus-container')
  if (!container || container.dataset.loaded === 'true') return
  container.dataset.loaded = 'true'

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.async = true
  script.crossOrigin = 'anonymous'

  const attrs: Record<string, string> = {
    'data-repo': cfg.repo,
    'data-repo-id': cfg.repoId,
    'data-category': cfg.category,
    'data-category-id': cfg.categoryId,
    'data-mapping': cfg.mapping,
    'data-strict': '0',
    'data-reactions-enabled': cfg.reactionsEnabled,
    'data-emit-metadata': '0',
    'data-input-position': cfg.inputPosition,
    'data-theme': currentTheme(),
    'data-lang': cfg.lang,
    'data-loading': 'lazy'
  }

  for (const [key, value] of Object.entries(attrs)) {
    script.setAttribute(key, value)
  }
  container.appendChild(script)
}

onMounted(() => {
  if (!configured.value) return
  mount()
  // 主题由 html 上的 class 控制，直接监听它即可
  observer = new MutationObserver(syncTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section v-if="configured" class="comments">
    <header class="comments-head">
      <span class="comments-label">评论</span>
      <a class="comments-link" :href="`https://github.com/${cfg.repo}/discussions`" target="_blank" rel="noopener">
        在 GitHub 上参与讨论 →
      </a>
    </header>
    <div id="giscus-container" class="giscus-container"></div>
  </section>

  <!-- 仅在本地开发时提示，线上未配置则完全不渲染 -->
  <section v-else-if="isDev" class="comments comments-placeholder">
    <p>
      评论区尚未启用。打开 <code>docs/.vitepress/site.mts</code>，把 giscus 的
      <code>repoId</code> 与 <code>categoryId</code> 填上即可（步骤见 README）。
    </p>
  </section>
</template>

<style scoped>
.comments {
  margin-top: 56px;
  padding-top: 28px;
  border-top: 1px solid var(--vp-c-divider);
}

.comments-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.comments-label {
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-2);
}

.comments-link {
  font-size: 12.5px;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.2s;
}

.comments-link:hover {
  color: var(--vp-c-brand-1);
}

.giscus-container {
  min-height: 120px;
}

.comments-placeholder {
  padding: 16px 18px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 10px;
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.comments-placeholder p {
  margin: 0;
  line-height: 1.7;
}

.comments-placeholder code {
  font-size: 12px;
  color: var(--vp-c-brand-1);
}
</style>
