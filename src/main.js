import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import { loadAdminPosts } from './data/posts.js'

// Load server-side admin posts before mounting so PostView routing works correctly
loadAdminPosts().finally(() => {
  createApp(App).use(router).mount('#app')
})
