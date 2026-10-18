<script setup lang="ts">
import { now } from '../../now.mts'

const updated = now.updated.replace(/-/g, '.')
</script>

<template>
  <section class="now">
    <header class="now-head">
      <h2 class="now-title">最近在做</h2>
      <span class="now-updated">更新于 {{ updated }}</span>
    </header>

    <ul class="now-list">
      <li v-for="(item, index) in now.items" :key="index" class="now-row">
        <span class="now-index">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="now-text">{{ item }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.now {
  max-width: 1152px;
  margin: 36px auto 36px;
}

.now-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
  padding: 0 4px;
}

.now-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  border: none;
}

.now-updated {
  font-size: 13px;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}

.now-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--vp-c-divider);
}

.now-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 16px 6px;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.2s ease;
}

.now-row:hover {
  background-color: var(--vp-c-bg-soft);
}

.now-index {
  flex: none;
  width: 24px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

.now-text {
  font-size: 15px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}

@media (max-width: 640px) {
  .now-text {
    font-size: 14px;
  }
}
</style>
