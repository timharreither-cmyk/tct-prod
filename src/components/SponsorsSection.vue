<script setup>
import { sponsors } from '../data/sponsors.js'
</script>

<template>
  <section class="section" id="sponsoren">
    <div class="container">
      <span class="section__label">Unsere Partner</span>
      <div class="divider"></div>
      <h2 class="section__title" style="margin-bottom: 3rem">
        Danke an unsere<br><em>Sponsoren & Partner</em>
      </h2>

      <div class="sponsors__grid">
        <a
          v-for="s in sponsors"
          :key="s.name"
          :href="s.url"
          target="_blank"
          rel="noopener"
          class="sponsor-item"
          :class="{ 'sponsor-item--main': s.category === 'Hauptsponsor' }"
        >
          <div class="sponsor-item__inner">
            <span v-if="s.category === 'Hauptsponsor'" class="sponsor-item__badge">Hauptsponsor</span>
            <span class="sponsor-item__name">{{ s.name }}</span>
          </div>
        </a>
      </div>

      <p class="sponsors__cta">
        Interesse an einer Partnerschaft?
        <RouterLink to="/kontakt" class="sponsors__cta-link">Kontaktieren Sie uns</RouterLink>
      </p>
    </div>
  </section>
</template>

<style scoped>
.section__title em {
  font-style: italic;
  color: var(--blue);
}

.sponsors__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5px;
  background-color: var(--border);
}

.sponsor-item {
  background-color: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  min-height: 90px;
  text-decoration: none;
  transition: background-color var(--transition);
}

.sponsor-item:hover {
  background-color: var(--white);
}

.sponsor-item--main {
  grid-column: span 2;
  min-height: 110px;
}

.sponsor-item__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.4rem;
}

.sponsor-item__badge {
  font-size: 0.6rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--blue);
}

.sponsor-item__name {
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--black);
  text-align: center;
  letter-spacing: 0.03em;
  opacity: 0.7;
  transition: opacity var(--transition);
}

.sponsor-item:hover .sponsor-item__name {
  opacity: 1;
}

.sponsors__cta {
  margin-top: 2.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--muted);
}

.sponsors__cta-link {
  color: var(--blue);
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
  margin-left: 0.3rem;
}

@media (max-width: 768px) {
  .sponsors__grid { grid-template-columns: repeat(2, 1fr); }
  .sponsor-item--main { grid-column: span 2; }
}

@media (max-width: 480px) {
  .sponsors__grid { grid-template-columns: 1fr; }
  .sponsor-item--main { grid-column: span 1; }
}
</style>
