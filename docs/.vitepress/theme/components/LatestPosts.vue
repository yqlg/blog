<script setup lang="ts">
import { withBase } from 'vitepress'
import { data as posts } from '../../posts.data.mts'

const props = withDefaults(defineProps<{ limit?: number }>(), { limit: 6 })
const latest = posts.slice(0, props.limit)

const sectionLabel = (section: string) => (section === 'notes' ? '笔记' : '随笔')
const formatDate = (date: string) => date.replace(/-/g, '.')
</script>

<template>
  <section class="latest-posts">
    <header class="latest-head">
      <h2 class="latest-title">最新文章</h2>
      <a class="latest-more" :href="withBase('/archive.html')">全部归档 →</a>
    </header>

    <ul class="latest-list">
      <li v-for="(post, index) in latest" :key="post.url" class="latest-item">
        <a class="latest-link" :href="withBase(post.url)">
          <span class="latest-index">{{ String(index + 1).padStart(2, '0') }}</span>
          <span class="latest-main">
            <span class="latest-row">
              <span class="latest-badge" :class="`is-${post.section}`">{{ sectionLabel(post.section) }}</span>
              <span class="latest-name">{{ post.title }}</span>
            </span>
            <span v-if="post.description" class="latest-desc">{{ post.description }}</span>
          </span>
          <time class="latest-date">{{ formatDate(post.date) }}</time>
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.latest-posts {
  max-width: 1152px;
  margin: 8px auto 0;
}

.latest-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 8px;
  padding: 0 4px;
}

.latest-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.01em;
  border: none;
}

.latest-more {
  font-size: 13px;
  color: var(--vp-c-text-2);
  text-decoration: none;
  transition: color 0.2s;
}

.latest-more:hover {
  color: var(--vp-c-brand-1);
}

.latest-list {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--vp-c-divider);
}

.latest-item {
  border-bottom: 1px solid var(--vp-c-divider);
}

.latest-link {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 16px 6px;
  text-decoration: none;
  color: inherit;
  transition: background-color 0.2s ease;
}

.latest-link:hover {
  background-color: var(--vp-c-bg-soft);
}

.latest-index {
  flex: none;
  width: 24px;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

.latest-main {
  flex: 1;
  min-width: 0;
}

.latest-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.latest-badge {
  flex: none;
  font-size: 11px;
  line-height: 1;
  padding: 4px 7px;
  border-radius: 5px;
  color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
  border: 1px solid transparent;
}

.latest-badge.is-essays {
  color: #a3631a;
  background: rgba(197, 128, 32, 0.12);
}

.dark .latest-badge.is-essays {
  color: #e2b071;
  background: rgba(226, 176, 113, 0.12);
}

.latest-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.latest-link:hover .latest-name {
  color: var(--vp-c-brand-1);
}

.latest-desc {
  display: block;
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.latest-date {
  flex: none;
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .latest-desc {
    display: none;
  }

  .latest-date {
    font-size: 11px;
  }
}
</style>
