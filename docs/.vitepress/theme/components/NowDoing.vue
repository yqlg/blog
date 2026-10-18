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
      <li v-for="(item, index) in now.items" :key="index" class="now-item">
        <span class="now-dot" aria-hidden="true"></span>
        <span>{{ item }}</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.now {
  max-width: 1152px;
  margin: 8px auto 40px;
  padding: 22px 0 0;
  border-top: 1px solid var(--vp-c-divider);
}

.now-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.now-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  border: none;
}

.now-updated {
  font-size: 12px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.now-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 36px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.now-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.now-dot {
  flex: none;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .now-list {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
