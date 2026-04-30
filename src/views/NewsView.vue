<script setup>
import { ref, computed } from 'vue'
import { getAllPosts } from '../data/posts.js'

const activeCategory = ref('Alle')

const categories = computed(() => {
  const cats = ['Alle', ...new Set(getAllPosts().map(p => p.category))]
  return cats
})

const filtered = computed(() => {
  const all = getAllPosts()
  return activeCategory.value === 'Alle'
    ? all
    : all.filter(p => p.category === activeCategory.value)
})

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
  <div class="news-page">
    <!-- Page header -->
    <div class="news-page__header">
      <div class="container">
        <span class="section__label">Neuigkeiten</span>
        <div class="divider"></div>
        <h1 class="news-page__title">Alle <em>News</em></h1>
        <p class="news-page__sub">Aktuelles aus dem Tennisclub Tulln – Berichte, Events und Vereinsnachrichten.</p>
      </div>
    </div>

    <!-- Filter -->
    <div class="news-page__filter">
      <div class="container">
        <div class="filter__bar">
          <button
            v-for="cat in categories"
            :key="cat"
            class="filter__btn"
            :class="{ 'filter__btn--active': activeCategory === cat }"
            @click="activeCategory = cat"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </div>

    <!-- Posts grid -->
    <section class="section section--white">
      <div class="container">
        <div class="news-all__grid">
          <article
            v-for="post in filtered"
            :key="post.id"
            class="news-all__card"
          >
            <div v-if="extractImage(post.content)" class="news-all__img-wrap">
              <img :src="extractImage(post.content)" :alt="post.title" class="news-all__img" />
            </div>
            <div class="news-all__body">
              <div class="news-all__meta">
                <span class="tag">{{ post.category }}</span>
                <time class="news-all__date">{{ formatDate(post.date) }}</time>
              </div>
              <h2 class="news-all__title">{{ post.title }}</h2>
              <p class="news-all__excerpt">{{ post.excerpt }}</p>
              <RouterLink :to="`/news/${post.slug}`" class="news-all__link">
                Artikel lesen
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </RouterLink>
            </div>
          </article>
        </div>

        <div v-if="filtered.length === 0" class="news-all__empty">
          Keine Artikel in dieser Kategorie.
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.news-page__header {
  background-color: var(--bg-dark);
  padding: 8rem 0 4rem;
  color: var(--white);
}

.news-page__title {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 600;
  color: var(--white);
  line-height: 1.05;
  margin-bottom: 1rem;
}

.news-page__title em {
  font-style: italic;
  color: var(--blue-light);
}

.news-page__sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.5);
  max-width: 50ch;
}

.news-page__filter {
  background-color: var(--white);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 68px;
  z-index: 10;
}

.filter__bar {
  display: flex;
  gap: 0.25rem;
  padding: 1rem 0;
  overflow-x: auto;
  scrollbar-width: none;
}

.filter__btn {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.5rem 1.1rem;
  border: 1px solid var(--border);
  background-color: transparent;
  color: var(--muted);
  cursor: pointer;
  transition: var(--transition);
  white-space: nowrap;
}

.filter__btn:hover,
.filter__btn--active {
  background-color: var(--blue);
  color: var(--white);
  border-color: var(--blue);
}

.news-all__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5px;
  background-color: var(--border);
}

.news-all__card {
  background-color: var(--white);
  padding: 0;
  display: flex;
  flex-direction: column;
  transition: background-color var(--transition);
  overflow: hidden;
}

.news-all__img-wrap {
  width: 100%;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  flex-shrink: 0;
}

.news-all__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.news-all__card:hover .news-all__img {
  transform: scale(1.04);
}

.news-all__body {
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.news-all__card:hover {
  background-color: var(--bg);
}

.news-all__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.news-all__date {
  font-size: 0.72rem;
  color: var(--muted);
}

.news-all__title {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  font-weight: 600;
  line-height: 1.25;
  color: var(--black);
}

.news-all__excerpt {
  font-size: 0.88rem;
  color: var(--muted);
  line-height: 1.65;
  flex-grow: 1;
}

.news-all__link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--blue);
  text-decoration: none;
  transition: gap var(--transition);
  margin-top: auto;
}

.news-all__link:hover { gap: 0.8rem; }

.news-all__empty {
  padding: 4rem;
  text-align: center;
  color: var(--muted);
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .news-page__header {
    padding: 6rem 0 3rem;
  }
}

@media (max-width: 700px) {
  .news-all__grid { grid-template-columns: 1fr; }
  .news-all__card { padding: 1.75rem; }
}
</style>
