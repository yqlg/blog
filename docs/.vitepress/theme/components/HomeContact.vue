<script setup lang="ts">
import { site } from '../../site.mts'

const { author } = site
</script>

<template>
  <footer class="home-contact">
    <p class="home-contact-text">
      如果这些文字对你有点用，或者只是想聊聊天，欢迎来信。
    </p>

    <div class="home-contact-links">
      <a class="contact-item" :href="`mailto:${author.email}`">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Zm2.2-.5 6.8 5.1L18.8 6H5.2Z"
            fill="currentColor"
          />
        </svg>
        <span>{{ author.email }}</span>
      </a>

      <a class="contact-item" :href="author.github" target="_blank" rel="noopener">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.36 1.09 2.94.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85v2.74c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"
            fill="currentColor"
          />
        </svg>
        <span>GitHub</span>
      </a>

      <span class="contact-item is-static" :title="`QQ：${author.qq}`">
        <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
          <path
            d="M12 3c3.1 0 5.4 2.3 5.4 5.4 0 .9.4 1.6 1 2.6.9 1.4 1.6 2.9 1.6 4.3 0 1-.5 1.4-1.1 1.4-.5 0-1-.4-1.4-1.1-.2.9-.7 1.9-1.4 2.7.6.3 1 .8 1 1.3 0 .9-1.4 1.6-3.1 1.6-1 0-1.9-.3-2.4-.7-.5.4-1.4.7-2.4.7-1.7 0-3.1-.7-3.1-1.6 0-.5.4-1 1-1.3-.7-.8-1.2-1.8-1.4-2.7-.4.7-.9 1.1-1.4 1.1-.6 0-1.1-.4-1.1-1.4 0-1.4.7-2.9 1.6-4.3.6-1 1-1.7 1-2.6C6.6 5.3 8.9 3 12 3Z"
            fill="currentColor"
          />
        </svg>
        <span>QQ {{ author.qq }}</span>
      </span>
    </div>
  </footer>
</template>

<style scoped>
.home-contact {
  max-width: 1152px;
  margin: 40px auto 0;
  padding-top: 24px;
  border-top: 1px solid var(--vp-c-divider);
}

.home-contact-text {
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.home-contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 24px;
}

.contact-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--vp-c-text-3);
  text-decoration: none;
  transition: color 0.2s;
}

a.contact-item:hover {
  color: var(--vp-c-brand-1);
}

.contact-item svg {
  flex: none;
  opacity: 0.75;
}
</style>
