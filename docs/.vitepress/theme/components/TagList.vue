<script setup lang="ts">
import { computed, ref } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../../posts.data.mts'
import type { Post } from '../../posts.data.mts'

const selected = ref('')

const tagMap = computed(() => {
  const map = new Map<string, number>()
  for (const post of posts as Post[]) {
    for (const tag of post.tags) map.set(tag, (map.get(tag) ?? 0) + 1)
  }
  return [...map.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], 'zh-CN'))
})

const selectedPosts = computed(() =>
  selected.value ? (posts as Post[]).filter((post) => post.tags.includes(selected.value)) : (posts as Post[])
)
</script>

<template>
  <div class="tag-page">
    <div class="tag-cloud">
      <button class="tag-chip" :class="{ active: selected === '' }" @click="selected = ''">
        全部<span class="tag-count">{{ posts.length }}</span>
      </button>
      <button
        v-for="[tag, count] in tagMap"
        :key="tag"
        class="tag-chip"
        :class="{ active: selected === tag }"
        @click="selected = selected === tag ? '' : tag"
      >
        {{ tag }}<span class="tag-count">{{ count }}</span>
      </button>
    </div>

    <ul class="tag-posts">
      <li v-for="post in selectedPosts" :key="post.url" class="tag-post">
        <time class="tag-post-date">{{ post.date }}</time>
        <a class="tag-post-title" :href="withBase(post.url)">{{ post.title }}</a>
        <span class="tag-post-tags">
          <button
            v-for="tag in post.tags"
            :key="tag"
            class="tag-mini"
            @click="selected = tag"
          >#{{ tag }}</button>
        </span>
      </li>
    </ul>

    <p v-if="!selectedPosts.length" class="tag-empty">这个标签下还没有文章。</p>
  </div>
</template>

<style scoped>
.tag-page {
  margin-top: 4px;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 28px;
}

.tag-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 13px;
  line-height: 1.4;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.tag-chip:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.tag-chip.active {
  color: #fff;
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.tag-count {
  font-size: 11px;
  font-variant-numeric: tabular-nums;
  opacity: 0.7;
}

.tag-posts {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--vp-c-divider);
}

.tag-post {
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 12px 4px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.tag-post-date {
  flex: none;
  width: 92px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

.tag-post-title {
  flex: 1;
  font-size: 15px;
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.tag-post-title:hover {
  color: var(--vp-c-brand-1);
}

.tag-post-tags {
  display: flex;
  gap: 6px;
}

.tag-mini {
  padding: 2px 6px;
  font-size: 11px;
  color: var(--vp-c-text-3);
  background: transparent;
  border: none;
  cursor: pointer;
}

.tag-mini:hover {
  color: var(--vp-c-brand-1);
}

.tag-empty {
  color: var(--vp-c-text-3);
  font-size: 14px;
}

@media (max-width: 640px) {
  .tag-post-tags {
    display: none;
  }

  .tag-post-date {
    width: 78px;
  }
}
</style>
