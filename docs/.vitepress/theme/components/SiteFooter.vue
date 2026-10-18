<script setup lang="ts">
import { ref } from 'vue'
import { withBase } from 'vitepress'
import { site } from '../../site.mts'

const copied = ref(false)

async function copyQQ() {
  try {
    await navigator.clipboard.writeText(site.author.qq)
  } catch {
    // 老浏览器兜底：不弹窗，只是保持安静
    return
  }
  copied.value = true
  window.setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <footer class="site-footer">
    <nav class="site-footer-icons" aria-label="联系方式">
      <a :href="`mailto:${site.author.email}`" aria-label="发邮件" title="发邮件">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="2.5" />
          <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
        </svg>
      </a>

      <a :href="site.author.github" target="_blank" rel="noopener" aria-label="GitHub" title="GitHub">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      </a>

      <button type="button" aria-label="复制 QQ 号" title="QQ" @click="copyQQ">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.6 9.6 0 0 1-3-.5L4 21l1.6-3.8A8.2 8.2 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z" />
          <circle cx="8.6" cy="11" r="1" fill="currentColor" stroke="none" />
          <circle cx="12" cy="11" r="1" fill="currentColor" stroke="none" />
          <circle cx="15.4" cy="11" r="1" fill="currentColor" stroke="none" />
        </svg>
        <span class="site-footer-toast" :class="{ show: copied }">已复制</span>
      </button>

      <a :href="withBase('/feed.xml')" aria-label="RSS 订阅" title="RSS 订阅">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 11a9 9 0 0 1 9 9" />
          <path d="M4 4a16 16 0 0 1 16 16" />
          <circle cx="5" cy="19" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </nav>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 26px 24px 34px;
}

.site-footer-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 26px;
}

.site-footer-icons a,
.site-footer-icons button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  border-radius: 9px;
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.site-footer-icons a:hover,
.site-footer-icons button:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.site-footer-icons svg {
  width: 19px;
  height: 19px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.site-footer-toast {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translate(-50%, -2px);
  padding: 3px 7px;
  font-size: 11px;
  line-height: 1.4;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.18s ease;
  white-space: nowrap;
}

.site-footer-toast.show {
  opacity: 1;
}
</style>
