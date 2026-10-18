import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import Layout from './Layout.vue'
import LatestPosts from './components/LatestPosts.vue'
import PostList from './components/PostList.vue'
import TagList from './components/TagList.vue'
import NowDoing from './components/NowDoing.vue'
import './styles/custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 这些组件可以直接在 .md 里使用，例如 <PostList section="notes" />
    app.component('LatestPosts', LatestPosts)
    app.component('PostList', PostList)
    app.component('TagList', TagList)
    app.component('NowDoing', NowDoing)
  }
} satisfies Theme
