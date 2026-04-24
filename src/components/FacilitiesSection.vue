<script setup>
import imgOutdoor from '../assets/club-images/27a736696d930a0ebada09fc03f3f6c411e04f51.jpg'
import imgHall from '../assets/club-images/036334c08b2d997cfeae95be364676f9baad1380.jpg'
import imgClubhouse from '../assets/club-images/7d650a5e6d988d9b96465896254d5122f3cf26b1.JPG'

const facilities = [
  {
    id: 'outdoor',
    number: '01',
    title: 'Freiluft-Sandplätze',
    description: 'Unsere gepflegten Sandplätze bieten optimale Spielbedingungen – professionell saniert für die Saison 2026. Plätze 1–2 und 7–10 stehen zur Verfügung.',
    details: ['10+ Sandplätze', 'Saisonbetrieb', 'Online-Buchung', 'Flutlicht verfügbar'],
    image: imgOutdoor,
  },
  {
    id: 'hall',
    number: '02',
    title: 'Tennishalle',
    description: 'Ganzjährig spielen – unsere moderne Tennishalle ermöglicht auch im Winter intensives Training und Spiel auf höchstem Niveau.',
    details: ['Hallenplätze', 'Ganzjahresbetrieb', 'Professioneller Belag', 'Klimatisiert'],
    image: imgHall,
  },
  {
    id: 'clubhouse',
    number: '03',
    title: 'Clubhaus & Gastronomie',
    description: 'Das Herzstück des Vereins – unser Clubhaus bietet modernste Umkleidekabinen, Duschen und ab 1. Mai 2026 ein komplett erneuertes Clublokal.',
    details: ['Umkleidekabinen', 'Clublokal ab Mai 2026', 'Terrasse', 'Veranstaltungsräume'],
    image: imgClubhouse,
  },
]
</script>

<template>
  <section class="section section--dark" id="anlage">
    <div class="container">
      <span class="section__label">Unsere Anlage</span>
      <div class="divider"></div>
      <div class="facilities__header">
        <h2 class="section__title">Erstklassige<br><em>Infrastruktur</em></h2>
        <p class="section__body">
          Der TC Tulln verfügt über eine moderne Vereinsanlage mit Außen- und Hallenplätzen,
          einem vollwertigen Clubhaus und professioneller Gastronomie.
        </p>
      </div>

      <div class="facilities__grid">
        <div v-for="f in facilities" :key="f.id" class="facility-card">
          <div class="facility-card__img">
            <img :src="f.image" :alt="f.title" loading="lazy" />
          </div>
          <span class="facility-card__number">{{ f.number }}</span>
          <div class="facility-card__inner">
            <h3 class="facility-card__title">{{ f.title }}</h3>
            <p class="facility-card__desc">{{ f.description }}</p>
            <ul class="facility-card__details">
              <li v-for="d in f.details" :key="d">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                {{ d }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.facilities__header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
  align-items: end;
}

.facilities__header .section__title em {
  font-style: italic;
  color: var(--blue-light);
}

.facilities__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5px;
  background-color: var(--border-dark);
}

.facility-card {
  background-color: var(--bg-dark);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border: 1px solid var(--border-dark);
  transition: background-color var(--transition);
  overflow: hidden;
}

.facility-card:hover {
  background-color: rgba(26, 114, 216, 0.06);
}

.facility-card__img {
  height: 200px;
  overflow: hidden;
}

.facility-card__img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
}

.facility-card:hover .facility-card__img img {
  transform: scale(1.04);
}

.facility-card__number {
  padding: 0 2rem;
  font-family: var(--font-serif);
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--blue);
  letter-spacing: 0.1em;
}

.facility-card__inner {
  padding: 0 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.facility-card__title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--white);
  line-height: 1.2;
}

.facility-card__desc {
  font-size: 0.88rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.7;
}

.facility-card__details {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--border-dark);
}

.facility-card__details li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.45);
  letter-spacing: 0.04em;
}

.facility-card__details li svg {
  color: var(--blue);
  flex-shrink: 0;
}

@media (max-width: 900px) {
  .facilities__header { grid-template-columns: 1fr; gap: 1.5rem; }
  .facilities__grid { grid-template-columns: 1fr; }
}
</style>
