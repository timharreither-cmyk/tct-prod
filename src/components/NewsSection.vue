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

function extractImage(content) {
  if (!content) return null
  const m = content.match(/!\[.*?\]\((.*?)\)/)
  return m ? m[1] : null
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
          <div class="news-card__inner" :class="{ 'news-card__inner--with-img': extractImage(post.content) }">
            <div class="news-card__text">
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
            </div>
            <div v-if="extractImage(post.content)" class="news-card__img-wrap">
              <img :src="extractImage(post.content)" :alt="post.title" class="news-card__img" />
            </div>
          </div>
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
  transition: background-color var(--transition);
}

.news-card__inner {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.news-card__inner--with-img {
  flex-direction: row;
  align-items: flex-start;
  gap: 1.25rem;
}

.news-card__text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-width: 0;
}

.news-card__img-wrap {
  width: 160px;
  flex-shrink: 0;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  border-radius: 2px;
  opacity: 0.85;
}

.news-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.news-card:hover .news-card__img {
  transform: scale(1.05);
  opacity: 1;
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
  white-space: nowrap;
}

.news-card__title {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--black);
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-card__excerpt {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.65;
  flex-grow: 1;
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
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

@media (max-width: 1100px) {
  .news__grid {
    grid-template-columns: 1fr 1fr;
  }
  .news-card--featured {
    grid-column: 1 / -1;
  }
  .news-card__img-wrap { width: 140px; }
}

@media (max-width: 900px) {
  .news__header {
    flex-direction: column;
    align-items: flex-start;
  }
  .news-card { padding: 2rem 1.75rem; }
  .news-card--featured { padding: 2.25rem 2rem; }
}

@media (max-width: 640px) {
  .news__grid {
    grid-template-columns: 1fr;
  }
  .news-card,
  .news-card--featured { padding: 1.75rem 1.5rem; }
  .news-card__inner--with-img {
    flex-direction: column;
    gap: 1rem;
  }
  .news-card__img-wrap {
    width: 100%;
    aspect-ratio: 16 / 9;
    order: -1;
  }
  .news-card--featured .news-card__title { font-size: 1.3rem; }
  .news-card__title { font-size: 1.1rem; }
  .news-card__meta {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>
