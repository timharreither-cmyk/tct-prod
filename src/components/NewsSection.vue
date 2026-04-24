<script setup>
import { computed } from 'vue'
import { getRecentPosts } from '../data/posts.js'

const posts = computed(() => getRecentPosts(3))

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-AT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}
</script>

<template>
  <section class="section section--white" id="news">
    <div class="container">
      <div class="news__header">
        <div>
          <span class="section__label">Aktuelles</span>
          <div class="divider"></div>
          <h2 class="section__title">Neuigkeiten aus<br><em>dem Club</em></h2>
        </div>
        <RouterLink to="/news" class="btn btn--outline news__all">
          Alle News
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </RouterLink>
      </div>

      <div class="news__grid">
        <article
          v-for="(post, i) in posts"
          :key="post.id"
          class="news-card"
          :class="{ 'news-card--featured': i === 0 }"
        >
          <div class="news-card__meta">
            <span class="tag">{{ post.category }}</span>
            <time class="news-card__date">{{ formatDate(post.date) }}</time>
          </div>
          <h3 class="news-card__title">{{ post.title }}</h3>
          <p class="news-card__excerpt">{{ post.excerpt }}</p>
          <RouterLink :to="`/news/${post.slug}`" class="news-card__link">
            Weiterlesen
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </RouterLink>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.news__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 3rem;
  gap: 1rem;
}

.news__header .section__title em {
  font-style: italic;
  color: var(--blue);
}

.news__all {
  white-space: nowrap;
  align-self: flex-end;
}

.news__grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 1.5px;
  background-color: var(--border);
}

.news-card {
  background-color: var(--white);
  padding: 2.5rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: background-color var(--transition);
}

.news-card:hover {
  background-color: var(--bg);
}

.news-card--featured {
  padding: 3rem 2.5rem;
}

.news-card--featured .news-card__title {
  font-size: 1.6rem;
}

.news-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.news-card__date {
  font-size: 0.72rem;
  color: var(--muted);
  letter-spacing: 0.05em;
}

.news-card__title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--black);
}

.news-card__excerpt {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.65;
  flex-grow: 1;
}

.news-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--blue);
  transition: gap var(--transition);
  text-decoration: none;
  margin-top: auto;
}

.news-card__link:hover {
  gap: 0.8rem;
}

@media (max-width: 900px) {
  .news__grid {
    grid-template-columns: 1fr;
  }
  .news__header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
