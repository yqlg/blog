<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'
import { SECTIONS, type Section } from '../../sections.mts'

const { frontmatter, page } = useData()

const minutes = ref(0)

onMounted(() => {
  const content = document.querySelector('.vp-doc > div')
  const chars = (content?.textContent ?? '').replace(/\s+/g, '').length
  if (chars > 0) minutes.value = Math.max(1, Math.round(chars / 400))
})

const section = computed<Section>(() => (page.value.relativePath.split('/')[0] as Section) ?? 'notes')
const sectionLabel = computed(() => SECTIONS[section.value]?.label ?? '')

const date = computed(() => {
  const value = frontmatter.value.date
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value ?? '').slice(0, 10)
})

const tags = computed(() => {
  const value = frontmatter.value.tags
  return Array.isArray(value) ? value.map(String) : value ? [String(value)] : []
})

const weekday = computed(() => {
  const parsed = new Date(`${date.value}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return ''
  return ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][parsed.getDay()]
})
</script>

<template>
  <header class="post-header">
    <div class="post-kicker">
      <span class="post-section" :class="`is-${section}`">{{ sectionLabel }}</span>
      <span class="post-sep">/</span>
      <time :datetime="date">{{ date.replace(/-/g, '.') }} {{ weekday }}</time>
      <template v-if="minutes">
        <span class="post-sep">/</span>
        <span>约 {{ minutes }} 分钟</span>
      </template>
    </div>

    <h1 class="post-title">{{ frontmatter.title }}</h1>

    <p v-if="frontmatter.description" class="post-desc">{{ frontmatter.description }}</p>

    <div v-if="tags.length" class="post-tags">
      <span v-for="tag in tags" :key="tag" class="post-tag">#{{ tag }}</span>
    </div>
  </header>
</template>

<style scoped>
.post-header {
  margin-bottom: 36px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.post-kicker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  font-size: 12.5px;
  color: var(--vp-c-text-3);
}

.post-section {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.post-section.is-essays {
  color: #a3631a;
}

.post-section.is-journey {
  color: #37618f;
}

.dark .post-section.is-journey {
  color: #8ab4dd;
}

.dark .post-section.is-essays {
  color: #e2b071;
}

.post-sep {
  opacity: 0.4;
}

.post-title {
  margin: 0;
  font-size: 32px;
  line-height: 1.3;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--vp-c-text-1);
}

.post-desc {
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.75;
  color: var(--vp-c-text-2);
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}

.post-tag {
  padding: 3px 9px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  text-decoration: none;
  transition: color 0.18s, border-color 0.18s;
}

.post-tag:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

@media (max-width: 640px) {
  .post-title {
    font-size: 26px;
  }
}
</style>
