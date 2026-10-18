<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { useData } from 'vitepress'
import PostHeader from './components/PostHeader.vue'
import Giscus from './components/Giscus.vue'
import SiteFooter from './components/SiteFooter.vue'
import ThemeToggle from './components/ThemeToggle.vue'

const { Layout } = DefaultTheme
const { frontmatter } = useData()
</script>

<template>
  <Layout>
    <template #doc-before>
      <PostHeader v-if="frontmatter.date" />
    </template>
    <template #doc-after>
      <Giscus v-if="frontmatter.date" />
    </template>
    <template #nav-bar-content-after>
      <ThemeToggle />
    </template>
    <template #layout-bottom>
      <SiteFooter />
    </template>
  </Layout>
</template>
