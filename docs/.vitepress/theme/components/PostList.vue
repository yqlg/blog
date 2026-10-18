<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../posts.data.mts'
import type { Post } from '../../posts.data.mts'
import { SECTIONS, type Section } from '../../sections.mts'

const props = withDefaults(defineProps<{ section?: Section | 'all' }>(), { section: 'all' })

const filterPosts = computed(() =>
  props.section === 'all' ? posts : posts.filter((post: Post) => post.section === props.section)
)

const groups = computed(() => {
  const map = new Map<string, Post[]>()
  for (const post of filterPosts.value) {
    const year = post.date.slice(0, 4)
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(post)
  }
  return [...map.entries()].sort((a, b) => Number(b[0]) - Number(a[0]))
})

const sectionLabel = (section: Section) => SECTIONS[section].short
</script>

<template>
  <div class="post-list">
    <section v-for="[year, items] in groups" :key="year" class="post-year">
      <h2 class="post-year-title" :id="`y-${year}`">
        {{ year }}
        <span class="post-year-count">{{ items.length }} 篇</span>
      </h2>

      <ul class="post-rows">
        <li v-for="post in items" :key="post.url" class="post-row">
          <time class="post-row-date">{{ post.date.slice(5) }}</time>
          <a class="post-row-title" :href="withBase(post.url)">{{ post.title }}</a>
          <span v-if="section === 'all'" class="post-row-section">{{ sectionLabel(post.section) }}</span>
        </li>
      </ul>
    </section>

    <p v-if="!groups.length" class="post-empty">这里还没有文章，去写第一篇吧。</p>
  </div>
</template>

<style scoped>
.post-list {
  margin-top: 8px;
}

.post-year + .post-year {
  margin-top: 36px;
}

.post-year-title {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0 0 6px;
  padding: 0;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-2);
  border: none;
}

.post-year-count {
  font-size: 12px;
  font-weight: 400;
  color: var(--vp-c-text-3);
}

.post-rows {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--vp-c-divider);
}

.post-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 12px 4px;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.2s;
}

.post-row:hover {
  background-color: var(--vp-c-bg-soft);
}

.post-row-date {
  flex: none;
  width: 44px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

.post-row-title {
  flex: 1;
  font-size: 15px;
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.post-row-title:hover {
  color: var(--vp-c-brand-1);
}

.post-row-section {
  flex: none;
  font-size: 11px;
  color: var(--vp-c-text-3);
}

.post-empty {
  color: var(--vp-c-text-3);
  font-size: 14px;
}
</style>
