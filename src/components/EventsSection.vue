<script setup>
import { computed } from 'vue'
import { getAllEvents, formatEventDate } from '../data/events.js'

const events = computed(() =>
  [...getAllEvents()]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
    .map(e => ({
      ...e,
      dateParts: formatEventDate(e.date),
    }))
)
</script>

<template>
  <section class="section" id="events">
    <div class="container">
      <span class="section__label">Termine</span>
      <div class="divider"></div>
      <div class="events__header">
        <h2 class="section__title">Veranstaltungen<br><em>& Events</em></h2>
      </div>

      <div v-if="events.length" class="events__list">
        <article v-for="event in events" :key="event.id" class="event-item">
          <div class="event-item__date">
            <span class="event-item__day">{{ event.dateParts.day }}</span>
            <span class="event-item__month">{{ event.dateParts.month }}</span>
            <span class="event-item__year">{{ event.dateParts.year }}</span>
          </div>
          <div class="event-item__body">
            <div class="event-item__content">
              <div class="event-item__top">
                <span class="tag">{{ event.tag }}</span>
                <div class="event-item__details">
                  <span v-if="event.time">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {{ event.time }}
                  </span>
                  <span v-if="event.location">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ event.location }}
                  </span>
                </div>
              </div>
              <h3 class="event-item__title">{{ event.title }}</h3>
              <p class="event-item__desc">{{ event.description }}</p>
            </div>
            <div v-if="event.image" class="event-item__img-wrap">
              <img :src="event.image" :alt="event.title" class="event-item__img" />
            </div>
          </div>
        </article>
      </div>

      <div v-else class="events__empty">
        Derzeit sind keine Veranstaltungen geplant.
      </div>
    </div>
  </section>
</template>

<style scoped>
.events__header {
  margin-bottom: 2rem;
}

.events__header .section__title em {
  font-style: italic;
  color: var(--blue);
}

.events__list {
  display: flex;
  flex-direction: column;
  border-top: 1.5px solid var(--border);
}

.event-item {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 2rem;
  padding: 2rem 0;
  border-bottom: 1px solid var(--border);
  transition: background-color var(--transition);
}

.event-item:hover {
  background-color: rgba(0,0,0,0.02);
}

.event-item__date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 0.25rem;
  padding-right: 2rem;
  border-right: 1px solid var(--border);
  min-width: 80px;
}

.event-item__day {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  color: var(--blue);
}

.event-item__month {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  margin-top: 0.2rem;
}

.event-item__year {
  font-size: 0.68rem;
  color: var(--muted);
  opacity: 0.7;
}

.event-item__body {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  gap: 2rem;
}

.event-item__content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.event-item__img-wrap {
  width: 160px;
  flex-shrink: 0;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: 2px;
  opacity: 0.9;
}

.event-item__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.4s ease;
}

.event-item:hover .event-item__img {
  transform: scale(1.05);
  opacity: 1;
}

.event-item__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.event-item__details {
  display: flex;
  gap: 1.5rem;
}

.event-item__details span {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  color: var(--muted);
}

.event-item__title {
  font-family: var(--font-serif);
  font-size: 1.35rem;
  font-weight: 600;
  color: var(--black);
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-item__desc {
  font-size: 0.9rem;
  color: var(--muted);
  line-height: 1.65;
  max-width: 65ch;
  overflow-wrap: anywhere;
  word-break: break-word;
  hyphens: auto;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.events__empty {
  padding: 3rem 0;
  text-align: center;
  color: var(--muted);
  font-size: 0.95rem;
  border-top: 1.5px solid var(--border);
}

@media (max-width: 600px) {
  .event-item {
    grid-template-columns: 70px 1fr;
    gap: 1rem;
  }
  .event-item__day { font-size: 1.8rem; }
  .event-item__details { flex-direction: column; gap: 0.3rem; }
}
</style>
