import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import './assets/main.css'
import { loadAdminPosts } from './data/posts.js'
import { loadAdminEvents } from './data/events.js'

Promise.all([loadAdminPosts(), loadAdminEvents()]).finally(() => {
  createApp(App).use(router).mount('#app')
})
