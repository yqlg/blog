<script setup lang="ts">
import { computed } from 'vue'
import { modeLabel, toggleMode } from '../mode'

const label = computed(() => `主题：${modeLabel.value}（点击切换）`)
</script>

<template>
  <button class="theme-toggle" type="button" :title="label" :aria-label="label" @click="toggleMode">
    <!-- 两个图标都渲染，由 html.dark 决定显示哪个，避免首屏闪烁 -->
    <svg class="icon-sun" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M4.5 4.5l1.4 1.4M18.1 18.1l1.4 1.4M2.5 12h2M19.5 12h2M4.5 19.5l1.4-1.4M18.1 5.9l1.4-1.4" />
    </svg>
    <svg class="icon-moon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.2 14.4A8.3 8.3 0 0 1 9.6 3.8 8.4 8.4 0 1 0 20.2 14.4Z" />
    </svg>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-right: 4px;
  padding: 0;
  color: var(--vp-c-text-2);
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: color 0.18s ease, background-color 0.18s ease;
}

.theme-toggle:hover {
  color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft);
}

.theme-toggle svg {
  width: 17px;
  height: 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* 图标的显示/隐藏规则放在全局 custom.css 里（scoped + :global 组合会被编译坏） */
</style>
