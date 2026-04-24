<script setup>
import { ref } from 'vue'

const tab = ref('sommer')

const summer = [
  { label: 'Jugend', note: 'Jahrgang 2007 oder jünger', price: 60 },
  { label: 'Student · Lehrling · Präsenzdiener', note: 'Max. 26 Jahre', price: 125 },
  { label: 'Senior', note: 'Jahrgang 1950 oder älter', price: 150 },
  { label: 'Erwachsene', note: 'Ab 18 Jahre', price: 250, earlyBird: 230 },
]

const winter = [
  { label: 'Kategorie A', hourly: 30, abo: 725 },
  { label: 'Kategorie B', hourly: 26, abo: 609 },
  { label: 'Kategorie C', hourly: 22, abo: 493 },
  { label: 'Kategorie D', hourly: 18, abo: 377 },
]
</script>

<template>
  <section class="section" id="mitgliedschaft">
    <div class="container">

      <div class="membership__header">
        <div>
          <span class="section__label">Mitgliedschaft</span>
          <div class="divider"></div>
          <h2 class="section__title">Teil des<br><em>TC Tulln</em> werden</h2>
        </div>
        <p class="section__body">
          Werden Sie Mitglied beim Tennisclub Tulln und genießen Sie alle
          Vorteile unserer Vereinsanlage. Für Jugend, Erwachsene und Familien.
        </p>
      </div>

      <div class="tabs">
        <button class="tab" :class="{ 'tab--active': tab === 'sommer' }" @click="tab = 'sommer'">
          Sommersaison <span class="tab__sub">Freiluft</span>
        </button>
        <button class="tab" :class="{ 'tab--active': tab === 'winter' }" @click="tab = 'winter'">
          Wintersaison <span class="tab__sub">Tennishalle</span>
        </button>
      </div>

      <div v-if="tab === 'sommer'" class="price-list">
        <div v-for="row in summer" :key="row.label" class="price-row">
          <div class="price-row__meta">
            <span class="price-row__label">{{ row.label }}</span>
            <span class="price-row__note">{{ row.note }}</span>
          </div>
          <div class="price-row__right">
            <span v-if="row.earlyBird" class="early-bird">
              Frühbucher bis 30. April — €{{ row.earlyBird }}
            </span>
            <span class="price-row__amount">€{{ row.price }}<small>&thinsp;/Jahr</small></span>
          </div>
        </div>
        <p class="price-list__note">
          Mitglieder genießen unbegrenzten Zugang zu allen Freiluftplätzen sowie Turnier- und Ligaspielberechtigung.
        </p>
      </div>

      <div v-if="tab === 'winter'" class="price-list">
        <div class="winter-head">
          <span></span>
          <span>Einzelstunde</span>
          <span>Abonnement <small>(29 Wochen)</small></span>
        </div>
        <div v-for="row in winter" :key="row.label" class="price-row price-row--winter">
          <span class="price-row__label">{{ row.label }}</span>
          <span class="price-row__amount">€{{ row.hourly }}<small>&thinsp;/h</small></span>
          <span class="price-row__amount">€{{ row.abo }}<small>&thinsp;/Saison</small></span>
        </div>
        <p class="price-list__note">
          Saison 22. September 2025 – 12. April 2026. Abonnements müssen bis 31. August bestätigt werden.
          Platzgebühr mit TCT-Clubtrainer: +€17/h.
        </p>
      </div>

      <div class="membership__cta">
        <RouterLink to="/kontakt" class="btn btn--primary">Mitglied werden</RouterLink>
        <span class="membership__cta-note">Fragen? Wir helfen gerne weiter.</span>
      </div>

    </div>
  </section>
</template>

<style scoped>
.membership__header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
  align-items: end;
}

.membership__header .section__title em {
  font-style: italic;
  color: var(--blue);
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 1px solid var(--border);
  margin-bottom: 0;
}

.tab {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
}

.tab:hover {
  color: var(--black);
}

.tab--active {
  color: var(--black);
  border-bottom-color: var(--black);
}

.tab__sub {
  font-size: 0.72rem;
  font-weight: 400;
  color: inherit;
  opacity: 0.6;
}

/* Price list */
.price-list {
  border: 1px solid var(--border);
  border-top: none;
  margin-bottom: 2.5rem;
}

.price-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid var(--border);
  gap: 1rem;
}

.price-row:last-of-type {
  border-bottom: none;
}

.price-row__meta {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.price-row__label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--black);
}

.price-row__note {
  font-size: 0.78rem;
  color: var(--muted);
}

.price-row__right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

.early-bird {
  font-size: 0.72rem;
  color: var(--blue);
  background: color-mix(in srgb, var(--blue) 8%, transparent);
  padding: 0.25rem 0.6rem;
  letter-spacing: 0.01em;
  white-space: nowrap;
}

.price-row__amount {
  font-family: var(--font-serif);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--black);
  white-space: nowrap;
}

.price-row__amount small {
  font-family: inherit;
  font-size: 0.7em;
  font-weight: 400;
  color: var(--muted);
}

/* Winter table */
.winter-head {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  padding: 0.6rem 1.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  border-bottom: 1px solid var(--border);
  background: color-mix(in srgb, var(--border) 30%, transparent);
}

.price-row--winter {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-content: unset;
}

.price-row--winter .price-row__label {
  font-size: 0.88rem;
}

/* Note */
.price-list__note {
  padding: 1rem 1.75rem;
  font-size: 0.78rem;
  color: var(--muted);
  line-height: 1.6;
  border-top: 1px solid var(--border);
  background: color-mix(in srgb, var(--border) 20%, transparent);
}

/* CTA */
.membership__cta {
  display: flex;
  align-items: center;
  gap: 1.25rem;
}

.membership__cta-note {
  font-size: 0.82rem;
  color: var(--muted);
}

@media (max-width: 768px) {
  .membership__header {
    grid-template-columns: 1fr;
  }

  .tabs {
    gap: 0;
  }

  .tab {
    flex: 1;
    justify-content: center;
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }

  .price-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
  }

  .price-row__right {
    width: 100%;
    justify-content: space-between;
  }

  .winter-head {
    display: none;
  }

  .price-row--winter {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
    align-items: flex-start;
  }

  .price-row--winter .price-row__amount:first-of-type::before {
    content: 'Einzelstunde: ';
    font-family: inherit;
    font-size: 0.72rem;
    font-weight: 400;
    color: var(--muted);
  }

  .price-list__note {
    padding: 0.85rem 1.25rem;
  }

  .membership__cta {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
