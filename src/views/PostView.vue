<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { marked } from 'marked'
import { getPostBySlug, getAllPosts } from '../data/posts.js'

const route = useRoute()
const router = useRouter()

const post = computed(() => getPostBySlug(route.params.slug))

if (!post.value) {
  router.replace('/news')
}

const renderedContent = computed(() => {
  if (!post.value) return ''
  return marked.parse(post.value.content)
    .replace(/<a href=/g, '<a target="_blank" rel="noopener noreferrer" href=')
})

const relatedPosts = computed(() =>
  getAllPosts()
    .filter(p => p.slug !== route.params.slug)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
)

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-AT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <div v-if="post" class="post-page">
    <!-- Back nav -->
    <div class="post-page__back-bar">
      <div class="container">
        <RouterLink to="/news" class="post-page__back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
          Alle News
        </RouterLink>
      </div>
    </div>

    <!-- Post header -->
    <header class="post-page__header">
      <div class="container">
        <div class="post-page__meta">
          <span class="tag">{{ post.category }}</span>
          <time class="post-page__date">{{ formatDate(post.date) }}</time>
        </div>
        <h1 class="post-page__title">{{ post.title }}</h1>
        <p class="post-page__excerpt">{{ post.excerpt }}</p>
      </div>
    </header>

    <!-- Post content -->
    <article class="post-page__content">
      <div class="container">
        <div class="post-body" v-html="renderedContent"></div>
      </div>
    </article>

    <!-- Related posts -->
    <section class="post-page__related section">
      <div class="container">
        <span class="section__label">Weitere Artikel</span>
        <div class="divider"></div>
        <div class="related__grid">
          <RouterLink
            v-for="p in relatedPosts"
            :key="p.id"
            :to="`/news/${p.slug}`"
            class="related__card"
          >
            <span class="tag">{{ p.category }}</span>
            <h3 class="related__title">{{ p.title }}</h3>
            <time class="related__date">{{ formatDate(p.date) }}</time>
          </RouterLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.post-page__back-bar {
  background-color: var(--white);
  border-bottom: 1px solid var(--border);
  padding: 5rem 0 1rem;
}

.post-page__back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  text-decoration: none;
  transition: color var(--transition);
}

.post-page__back:hover {
  color: var(--blue);
}

.post-page__header {
  background-color: var(--white);
  padding: 3rem 0 4rem;
  border-bottom: 1px solid var(--border);
}

.post-page__meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.post-page__date {
  font-size: 0.78rem;
  color: var(--muted);
}

.post-page__title {
  font-family: var(--font-serif);
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 600;
  line-height: 1.1;
  color: var(--black);
  margin: 0 auto 1.25rem;
  max-width: 20ch;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

.post-page__excerpt {
  font-size: 1.05rem;
  color: var(--muted);
  line-height: 1.65;
  max-width: 60ch;
  margin: 0 auto;
  text-align: center;
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

.post-page__content {
  background-color: var(--white);
  padding: 4rem 0 5rem;
}

.post-body {
  max-width: 720px;
  margin: 0 auto;
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--black);
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
}

/* Blog markdown styles */
:deep(.post-body h1) {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 600;
  margin: 2.5rem 0 1rem;
  color: var(--black);
  display: none;
}

:deep(.post-body h2) {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 2.5rem 0 0.75rem;
  color: var(--black);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
}

:deep(.post-body h3) {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  margin: 2rem 0 0.5rem;
  color: var(--black);
}

:deep(.post-body p) {
  margin-bottom: 1.25rem;
  color: #333;
}

:deep(.post-body ul),
:deep(.post-body ol) {
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}

:deep(.post-body li) {
  margin-bottom: 0.5rem;
  color: #333;
}

:deep(.post-body strong) {
  font-weight: 600;
  color: var(--black);
}

:deep(.post-body em) {
  font-style: italic;
  color: var(--blue);
}

:deep(.post-body blockquote) {
  border-left: 3px solid var(--blue);
  padding-left: 1.5rem;
  margin: 2rem 0;
  color: var(--muted);
  font-style: italic;
}

:deep(.post-body img) {
  max-width: 100%;
  height: auto;
  margin: 1.5rem 0;
  border: 1px solid var(--border);
}

:deep(.post-body a) {
  color: var(--blue);
  text-decoration: underline;
}

:deep(.post-body code) {
  font-family: 'Courier New', monospace;
  font-size: 0.88em;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 0.1em 0.35em;
  border-radius: 2px;
}

:deep(.post-body hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2.5rem 0;
}

/* Related */
.post-page__related {
  background-color: var(--bg);
}

.related__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5px;
  background-color: var(--border);
  margin-top: 2rem;
}

.related__card {
  background-color: var(--bg);
  padding: 2rem 1.75rem;
  text-decoration: none;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: background-color var(--transition);
}

.related__card:hover {
  background-color: var(--white);
}

.related__title {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--black);
  line-height: 1.25;
  flex-grow: 1;
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related__date {
  font-size: 0.72rem;
  color: var(--muted);
  margin-top: auto;
}

@media (max-width: 768px) {
  .post-page__back-bar {
    padding-top: 4.5rem;
  }

  .post-page__header {
    padding: 2rem 0 3rem;
  }
}

@media (max-width: 700px) {
  .related__grid { grid-template-columns: 1fr; }
}
</style>
