<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const activeSection = ref('geschichte')

const tabs = [
  { id: 'geschichte', label: 'Geschichte' },
  { id: 'vereinsleitung', label: 'Vereinsleitung' },
  { id: 'trainer', label: 'Trainer' },
  { id: 'platzwart', label: 'Platzwart' },
  { id: 'spielordnung', label: 'Spielordnung' },
  { id: 'clubline', label: 'Clubline' },
]

let observer

onMounted(() => {
  observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) activeSection.value = e.target.id }),
    { rootMargin: '-30% 0px -65% 0px' }
  )
  tabs.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })
})

onUnmounted(() => observer?.disconnect())

function scrollTo(id) {
  const el = document.getElementById(id)
  if (!el) return
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' })
}

const geschichte = [
  { year: '1903', text: 'Die Offiziers-Gesellschaft errichtet einen öffentlichen Tennisplatz in der Mühlbachgasse und gründet den ersten Tullner Tennisclub.' },
  { year: '1910', text: 'Nach dem Bau eines Schwimmbades verlegt der Club seine Anlage in den Stadtgraben nahe dem Pulverturm.' },
  { year: '1923', text: 'Neugründung nach dem Ersten Weltkrieg. Ab 1926 werden die Plätze im Winter als Eisbahn genutzt – in den 1930er-Jahren entstehen erste Vereinswettkämpfe.' },
  { year: '1948', text: 'Heimkehrende Soldaten bauen die Anlage neu auf und erweitern sie auf drei Plätze mit Clubhaus – damals als „eine der schönsten Tennisanlagen Österreichs" gelobt.' },
  { year: '1954', text: 'Das Turnier „Goldene Rose der Stadt Tulln" wird im Rahmen der Gartenbaumesse ins Leben gerufen – zunächst Doppelbewerbe, später auch Einzel mit Sponsoring.' },
  { year: '1980', text: 'Übersiedlung zur neuen Anlage in der Hafenstraße mit neun Sandplätzen und Clubhaus. Eine Lufthalle ergänzt den Betrieb, gefolgt von einer permanenten Vierplatz-Halle.' },
  { year: '1995', text: 'Nach nur vier Monaten Bauzeit eröffnet im Oktober die permanente Tennishalle.' },
  { year: '2004', text: 'Das Goldene-Rose-Turnier feiert sein 50-jähriges Jubiläum.' },
  { year: 'Heute', text: '10 Sandplätze im Freien, eine Vierplatz-Halle mit Hartbelag sowie ein modernes Clubhaus mit Restaurant.' },
]

const vereinsleitung = [
  { role: 'Obmann', name: 'Mag.(FH) Harald Huber', phone: '+43 676 736 98 89' },
  { role: 'Obmann-Stv.', name: 'Bernhard Steinböck, MSc.', phone: '+43 676 620 37 25' },
  { role: '2. Obmann-Stv.', name: 'Gerald Niedl', phone: '+43 664 433 94 86' },
  { role: 'Schriftführerin', name: 'Sigrid Schauer BEd BEd MEd', phone: null },
  { role: 'Schriftführer-Stv. & Sportl. Leiter', name: 'Vinzenz Wutzl', phone: null },
  { role: 'Kassier', name: 'Gregor Kaufmann', phone: null },
  { role: 'Kassier-Stv.', name: 'Johannes Rimpfl', phone: null },
  { role: 'Clubtrainer', name: 'Gerald Kaiser & Christian Wolf', phone: null },
  { role: 'Rechnungsprüfer', name: 'MMag. Judith Reichetseder & DI Stephan Böhm', phone: null },
]

const spielordnung = [
  { nr: '1', title: 'Spielzeiten', text: 'Täglich ab 7:00 Uhr bis Einbruch der Dunkelheit, längstens bis 21:00 Uhr. Prime-Time: Montag–Freitag 16:00–21:00 Uhr.' },
  { nr: '2', title: 'Spielberechtigung', text: 'Mitglieder buchen via e-Tennis für Plätze 1–2 und 7–10 oder nutzen die Magnetnamenskarte für Plätze 3–6. Gäste dürfen ausschließlich Plätze 7–10 über e-Tennis reservieren.' },
  { nr: '3a', title: 'Reservierung Plätze 3–6 (Magnetboard)', text: 'Reservierung 15 Minuten vor Spielbeginn vor Ort. Einzel: 45 Min., Doppel: 90 Min. Das Weiterrücken der Namenskarte ist verboten.' },
  { nr: '3b', title: 'Reservierung Plätze 1–2 & 7–10 (e-Tennis)', text: 'Buchung bis zu 7 Tage im Voraus, maximal 2 Stunden pro Buchung (4 Stunden gesamt). Same-Day-Prime-Time-Buchungen: max. 90 Minuten. Zugangsdaten sind nicht übertragbar.' },
  { nr: '4', title: 'Gastspielregelung', text: 'Nicht-Mitglieder reservieren Plätze 7–10 nur bis zu 3 Stunden im Voraus. Wird der Platz nicht innerhalb von 10 Minuten beansprucht, verfällt die Reservierung.' },
  { nr: '5', title: 'Platzsperren', text: 'Witterungsbedingte Verfügbarkeit wird ausschließlich vom Platzwart entschieden.' },
  { nr: '6', title: 'Platzgebühren 2026', text: 'Mitglieder: Sandplätze kostenfrei, Halle €12/Stunde. Gäste: Sand €24 (Prime-Time) / €20 (Standard), Halle €24 / €20.' },
]
</script>

<template>
  <div class="verein-page">

    <!-- Page Header -->
    <div class="verein-header">
      <div class="container">
        <span class="section__label">TC Tulln</span>
        <div class="divider" style="background-color: var(--blue-light)"></div>
        <h1 class="verein-header__title">Verein</h1>
        <p class="verein-header__sub">Geschichte, Führung und alles Wissenswerte rund um den Tennisclub Tulln.</p>
      </div>
    </div>

    <!-- Sticky Sub-Navigation -->
    <nav class="verein-tabs" aria-label="Seitennavigation">
      <div class="verein-tabs__inner">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          class="verein-tab"
          :class="{ 'verein-tab--active': activeSection === tab.id }"
          @click="scrollTo(tab.id)"
        >
          {{ tab.label }}
        </button>
      </div>
    </nav>

    <!-- Geschichte -->
    <section id="geschichte" class="section">
      <div class="container">
        <span class="section__label">Seit 1903</span>
        <h2 class="section__title">Geschichte</h2>
        <div class="divider"></div>
        <div class="timeline">
          <div v-for="item in geschichte" :key="item.year" class="timeline__item">
            <div class="timeline__year">{{ item.year }}</div>
            <div class="timeline__line-col">
              <div class="timeline__dot"></div>
            </div>
            <p class="timeline__text">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Vereinsleitung -->
    <section id="vereinsleitung" class="section section--white">
      <div class="container">
        <span class="section__label">Organisation</span>
        <h2 class="section__title">Vereinsleitung</h2>
        <div class="divider"></div>
        <div class="person-grid">
          <div v-for="p in vereinsleitung" :key="p.role" class="person-card">
            <span class="person-card__role">{{ p.role }}</span>
            <p class="person-card__name">{{ p.name }}</p>
            <a
              v-if="p.phone"
              :href="`tel:${p.phone.replace(/[\s/]/g, '')}`"
              class="person-card__phone"
            >{{ p.phone }}</a>
          </div>
        </div>
      </div>
    </section>

    <!-- Trainer -->
    <section id="trainer" class="section">
      <div class="container">
        <span class="section__label">Training</span>
        <h2 class="section__title">Trainer</h2>
        <div class="divider"></div>
        <div class="trainer-grid">
          <div class="trainer-card">
            <span class="tag trainer-card__tag">Erwachsenen-Tennis</span>
            <h3 class="trainer-card__name">Gerald Kaiser</h3>
            <div class="trainer-card__contacts">
              <a href="tel:+4369911616345" class="trainer-card__link">
                <svg class="trainer-card__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M2 4.5A2.5 2.5 0 014.5 2h1.372c.517 0 .968.349 1.1.849l.713 2.664a1.1 1.1 0 01-.32 1.098L6.09 7.754a13.065 13.065 0 006.155 6.155l1.143-1.275a1.1 1.1 0 011.098-.32l2.664.713c.5.133.85.584.85 1.1V15.5A2.5 2.5 0 0115.5 18C8.044 18 2 11.956 2 4.5z"/>
                </svg>
                +43 (699) 11 61 63 45
              </a>
            </div>
          </div>
          <div class="trainer-card">
            <span class="tag trainer-card__tag">Kids-Tennis</span>
            <h3 class="trainer-card__name">Christian Wolf</h3>
            <div class="trainer-card__contacts">
              <a href="tel:+436767460674" class="trainer-card__link">
                <svg class="trainer-card__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M2 4.5A2.5 2.5 0 014.5 2h1.372c.517 0 .968.349 1.1.849l.713 2.664a1.1 1.1 0 01-.32 1.098L6.09 7.754a13.065 13.065 0 006.155 6.155l1.143-1.275a1.1 1.1 0 011.098-.32l2.664.713c.5.133.85.584.85 1.1V15.5A2.5 2.5 0 0115.5 18C8.044 18 2 11.956 2 4.5z"/>
                </svg>
                +43 (676) 74 606 74
              </a>
              <a href="mailto:info@christianwolf.at" class="trainer-card__link">
                <svg class="trainer-card__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <rect x="2" y="4" width="16" height="12" rx="1.5"/>
                  <path d="M2 7l8 5 8-5"/>
                </svg>
                info@christianwolf.at
              </a>
              <a href="https://www.christianwolf.at" target="_blank" rel="noopener" class="trainer-card__link">
                <svg class="trainer-card__icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zM2 10h16M10 2c-2 2.5-3 5-3 8s1 5.5 3 8M10 2c2 2.5 3 5 3 8s-1 5.5-3 8"/>
                </svg>
                christianwolf.at
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Platzwart -->
    <section id="platzwart" class="section section--white">
      <div class="container">
        <span class="section__label">Anlage</span>
        <h2 class="section__title">Platzwart</h2>
        <div class="divider"></div>
        <div class="platzwart-card">
          <h3 class="platzwart-card__name">Robert Baumgartner</h3>
          <a href="tel:+436641254320" class="platzwart-card__phone">+43 (664) 125 43 20</a>
        </div>
      </div>
    </section>

    <!-- Spielordnung -->
    <section id="spielordnung" class="section">
      <div class="container">
        <span class="section__label">Regeln & Zeiten</span>
        <h2 class="section__title">Spielordnung</h2>
        <div class="divider"></div>
        <div class="rules">
          <div v-for="rule in spielordnung" :key="rule.nr" class="rule-item">
            <div class="rule-item__nr">{{ rule.nr }}</div>
            <div class="rule-item__content">
              <h4 class="rule-item__title">{{ rule.title }}</h4>
              <p class="rule-item__text">{{ rule.text }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Clubline TCT -->
    <section id="clubline" class="section section--dark">
      <div class="container">
        <span class="section__label" style="color: var(--blue-light)">Merchandise</span>
        <h2 class="section__title" style="color: var(--white)">Clubline TCT</h2>
        <div class="divider" style="background-color: var(--blue-light)"></div>
        <div class="clubline-body">
          <p class="clubline-desc">
            Die neue Bekleidungslinie <strong>„Clubline TC Tulln – change by erima"</strong> ist für Kinder, Damen und Herren erhältlich – geeignet für Freizeittennis und Wettkampf gleichermaßen. Bestellungen sind bis <strong>Ende 2027</strong> möglich.
          </p>
          <div class="clubline-info">
            <div class="clubline-row">
              <span class="clubline-label">Shop</span>
              <a href="https://x247.shop/tct52/" target="_blank" rel="noopener" class="clubline-value clubline-value--link">x247.shop/tct52</a>
            </div>
            <div class="clubline-row">
              <span class="clubline-label">Passwort</span>
              <span class="clubline-value">tulln52</span>
            </div>
            <div class="clubline-row">
              <span class="clubline-label">Zahlung</span>
              <span class="clubline-value">Online, Abholung bei Christian Ohrfandl – Korbel Austria, Wiener Straße 13, Tulln</span>
            </div>
            <div class="clubline-row">
              <span class="clubline-label">Kontakt</span>
              <a href="tel:+436603152292" class="clubline-value clubline-value--link">0660 / 315 22 92</a>
            </div>
          </div>
          <a href="https://x247.shop/tct52/" target="_blank" rel="noopener" class="btn btn--outline-white clubline-cta">
            Zum Shop &rarr;
          </a>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ── Page header ─────────────────────────────────────────── */
.verein-header {
  background-color: var(--bg-dark);
  padding: 8rem 0 4rem;
  color: var(--white);
}

.verein-header__title {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 600;
  color: var(--white);
  line-height: 1.05;
  margin-bottom: 1rem;
}

.verein-header__sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  max-width: 50ch;
}

/* ── Sticky tab nav ──────────────────────────────────────── */
.verein-tabs {
  position: sticky;
  top: 72px;
  z-index: 90;
  background: var(--white);
  border-bottom: 1px solid var(--border);
}

.verein-tabs__inner {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 2rem;
}

.verein-tabs__inner::-webkit-scrollbar {
  display: none;
}

.verein-tab {
  flex-shrink: 0;
  padding: 1rem 1.1rem;
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: color var(--transition), border-color var(--transition);
  margin-bottom: -1px;
}

.verein-tab:hover {
  color: var(--black);
}

.verein-tab--active {
  color: var(--blue);
  border-bottom-color: var(--blue);
}

/* ── Section scroll offset ───────────────────────────────── */
section[id] {
  scroll-margin-top: 130px;
}

/* ── Geschichte – timeline ───────────────────────────────── */
.timeline {
  position: relative;
  max-width: 780px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: calc(88px + 14px);
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: linear-gradient(to bottom, transparent, var(--border) 6%, var(--border) 94%, transparent);
}

.timeline__item {
  display: grid;
  grid-template-columns: 88px 28px 1fr;
  margin-bottom: 2.25rem;
  position: relative;
}

.timeline__item:last-child {
  margin-bottom: 0;
}

.timeline__year {
  font-family: var(--font-serif);
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--blue);
  text-align: right;
  padding-top: 0.15rem;
  line-height: 1.4;
}

.timeline__line-col {
  display: flex;
  justify-content: center;
  padding-top: 0.3rem;
}

.timeline__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--blue);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.timeline__text {
  color: var(--muted);
  font-size: 0.95rem;
  line-height: 1.75;
  padding-bottom: 0.25rem;
}

/* ── Vereinsleitung – person grid ────────────────────────── */
.person-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: var(--border);
  border: 1px solid var(--border);
}

.person-card {
  background: var(--white);
  padding: 1.75rem;
  transition: background-color var(--transition);
}

.person-card:hover {
  background-color: var(--bg);
}

.person-card__role {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--blue);
  display: block;
  margin-bottom: 0.5rem;
}

.person-card__name {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: var(--black);
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.person-card__phone {
  font-size: 0.82rem;
  color: var(--muted);
  transition: color var(--transition);
}

.person-card__phone:hover {
  color: var(--blue);
}

/* ── Trainer – cards ─────────────────────────────────────── */
.trainer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  max-width: 820px;
}

.trainer-card {
  background: var(--white);
  border: 1px solid var(--border);
  padding: 2.5rem;
}

.trainer-card__tag {
  display: inline-block;
  margin-bottom: 1.5rem;
}

.trainer-card__name {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 1.5rem;
  line-height: 1.15;
}

.trainer-card__contacts {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.trainer-card__link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.88rem;
  color: var(--muted);
  text-decoration: none;
  transition: color var(--transition);
}

.trainer-card__link:hover {
  color: var(--blue);
}

.trainer-card__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  opacity: 0.6;
}

/* ── Platzwart ───────────────────────────────────────────── */
.platzwart-card {
  display: inline-flex;
  flex-direction: column;
  gap: 0.75rem;
  border: 1px solid var(--border);
  padding: 2.5rem 3rem;
  background: var(--bg);
  min-width: 280px;
}

.platzwart-card__name {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--black);
  line-height: 1.15;
}

.platzwart-card__phone {
  font-size: 1rem;
  color: var(--blue);
  font-weight: 500;
  transition: opacity var(--transition);
}

.platzwart-card__phone:hover {
  opacity: 0.7;
}

/* ── Spielordnung – rules list ───────────────────────────── */
.rules {
  max-width: 800px;
}

.rule-item {
  display: flex;
  gap: 2rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid var(--border);
  align-items: flex-start;
}

.rule-item:first-child {
  border-top: 1px solid var(--border);
}

.rule-item__nr {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--blue);
  min-width: 2.25rem;
  padding-top: 0.1rem;
  flex-shrink: 0;
}

.rule-item__content {
  flex: 1;
}

.rule-item__title {
  font-family: var(--font-serif);
  font-size: 1rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 0.35rem;
}

.rule-item__text {
  color: var(--muted);
  font-size: 0.93rem;
  line-height: 1.75;
}

/* ── Clubline ────────────────────────────────────────────── */
.clubline-body {
  max-width: 640px;
}

.clubline-desc {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.75;
  margin-bottom: 2rem;
}

.clubline-desc strong {
  color: var(--white);
  font-weight: 500;
}

.clubline-info {
  border-top: 1px solid var(--border-dark);
  padding-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 0.5rem;
}

.clubline-row {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.clubline-label {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--blue-light);
  min-width: 72px;
  padding-top: 0.15rem;
  flex-shrink: 0;
}

.clubline-value {
  font-size: 0.93rem;
  color: rgba(255, 255, 255, 0.65);
  line-height: 1.5;
}

.clubline-value--link {
  color: var(--blue-light);
  transition: color var(--transition);
}

.clubline-value--link:hover {
  color: var(--white);
}

.clubline-cta {
  margin-top: 2rem;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 900px) {
  .person-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .timeline::before {
    left: calc(60px + 14px);
  }

  .timeline__item {
    grid-template-columns: 60px 28px 1fr;
  }

  .timeline__year {
    font-size: 0.78rem;
  }

  .person-grid {
    grid-template-columns: 1fr;
  }

  .trainer-grid {
    grid-template-columns: 1fr;
  }

  .rule-item {
    gap: 1.25rem;
  }

  .clubline-row {
    flex-direction: column;
    gap: 0.25rem;
  }

  .clubline-label {
    min-width: unset;
  }
}
</style>
