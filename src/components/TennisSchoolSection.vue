<script setup>
import imgSchool from '../assets/club-images/d9433c2fcafb540de58be11f09745dcbff97e785.jpg'

const offerings = [
  { title: 'Kindertraining', desc: 'Spielerische Einführung in den Tennissport ab 5 Jahren.' },
  { title: 'Jugendkurse', desc: 'Strukturiertes Training für Jugendliche aller Spielstärken.' },
  { title: 'Erwachsenenkurse', desc: 'Einzel- und Gruppentraining für Anfänger bis Fortgeschrittene.' },
  { title: 'Privatstunden', desc: 'Individuelles Coaching durch erfahrene Trainer.' },
]
</script>

<template>
  <section class="section section--white" id="tennisschule">
    <div class="container">
      <div class="school__grid">
        <div class="school__text">
          <span class="section__label">Tennisschule</span>
          <div class="divider"></div>
          <h2 class="section__title">Tennisschule<br><em>Christian Wolf</em></h2>
          <p class="section__body" style="margin-bottom: 2rem">
            Professionelles Tennistraining für jedes Alter und Level.
            Unsere Partnertrainerschule unter der Leitung von <strong>Christian Wolf</strong>
            bildet den tennisierenden Nachwuchs des TC Tulln aus – mit nachweisbaren Erfolgen
            auf Landes- und Bundesebene.
          </p>
          <div class="school__achievements">
            <div class="school__achievement">
              <span class="school__achievement-name">Laurin Laber</span>
              <span class="school__achievement-title">Landesmeister 2026</span>
            </div>
            <div class="school__achievement">
              <span class="school__achievement-name">Lars Schauerhuber</span>
              <span class="school__achievement-title">Landesmeister 2026</span>
            </div>
          </div>
          <a
            href="https://christianwolf.at"
            target="_blank"
            rel="noopener"
            class="btn btn--primary"
            style="margin-top: 2rem"
          >
            Zur Tennisschule
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>

        <div class="school__offerings">
          <div class="school__img">
            <img :src="imgSchool" alt="Tennisschule Christian Wolf" loading="lazy" />
          </div>
          <div class="school__offers-grid">
            <div v-for="o in offerings" :key="o.title" class="school__offer">
              <h4 class="school__offer-title">{{ o.title }}</h4>
              <p class="school__offer-desc">{{ o.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.school__grid {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 5rem;
  align-items: start;
}

.school__text .section__title em {
  font-style: italic;
  color: var(--blue);
}

.school__text .section__body strong {
  color: var(--black);
  font-weight: 600;
}

.school__achievements {
  display: flex;
  gap: 1.5rem;
  margin-top: 2rem;
  padding: 1.5rem;
  background-color: var(--bg);
  border-left: 3px solid var(--blue);
}

.school__achievement {
  display: flex;
  flex-direction: column;
}

.school__achievement-name {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--black);
}

.school__achievement-title {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--blue);
  margin-top: 0.2rem;
}

.school__offerings {
  display: flex;
  flex-direction: column;
  gap: 1.5px;
  background-color: var(--border);
  align-self: start;
}

.school__img {
  height: 220px;
  overflow: hidden;
}

.school__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.school__offers-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5px;
  background-color: var(--border);
}

.school__offer {
  background-color: var(--white);
  padding: 1.75rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  transition: background-color var(--transition);
}

.school__offer:hover {
  background-color: var(--bg);
}

.school__offer-title {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: var(--black);
}

.school__offer-desc {
  font-size: 0.82rem;
  color: var(--muted);
  line-height: 1.5;
}

@media (max-width: 900px) {
  .school__grid { grid-template-columns: 1fr; gap: 3rem; }
  .school__offerings { grid-template-columns: 1fr; }
}

@media (max-width: 500px) {
  .school__achievements {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
