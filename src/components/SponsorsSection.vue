<script setup>
import { sponsors } from '../data/sponsors.js'
</script>

<template>
  <section class="section section--white" id="sponsoren">
    <div class="container">
      <span class="section__label">Unsere Partner</span>
      <div class="divider"></div>
      <h2 class="section__title sponsors__heading">
        Danke an unsere<br><em>Sponsoren & Partner</em>
      </h2>
    </div>

    <div class="sponsors__track-wrap">
      <div class="sponsors__track">
        <a
          v-for="(s, i) in [...sponsors, ...sponsors]"
          :key="i"
          :href="s.url"
          target="_blank"
          rel="noopener"
          class="sponsor-card"
          :title="s.name"
        >
          <img :src="s.logo" :alt="s.name" class="sponsor-card__img" />
        </a>
      </div>
    </div>

    <div class="container">
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

.sponsors__heading {
  margin-bottom: 3rem;
}

/* ── Scrolling track ── */
.sponsors__track-wrap {
  overflow: hidden;
  padding: 0.5rem 0;
  mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0%,
    black 8%,
    black 92%,
    transparent 100%
  );
}

.sponsors__track {
  display: flex;
  gap: 1.25rem;
  width: max-content;
  animation: marquee 42s linear infinite;
}

.sponsors__track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ── Individual card ── */
.sponsor-card {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 180px;
  height: 90px;
  background: var(--white);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 1rem 1.25rem;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease,
    border-color 0.3s ease;
  cursor: pointer;
}

.sponsor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(26, 114, 216, 0.12), 0 2px 8px rgba(0,0,0,0.06);
  border-color: rgba(26, 114, 216, 0.3);
}

.sponsor-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: grayscale(30%);
  opacity: 0.85;
  transition: filter 0.3s ease, opacity 0.3s ease;
}

.sponsor-card:hover .sponsor-card__img {
  filter: grayscale(0%);
  opacity: 1;
}

/* ── CTA ── */
.sponsors__cta {
  margin-top: 3rem;
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
  transition: opacity 0.2s;
}

.sponsors__cta-link:hover {
  opacity: 0.75;
}
</style>
