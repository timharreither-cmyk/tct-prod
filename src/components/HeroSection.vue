<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import img0 from '../assets/club-images/7d650a5e6d988d9b96465896254d5122f3cf26b1.JPG'
import img1 from '../assets/club-images/27a736696d930a0ebada09fc03f3f6c411e04f51.jpg'
import img2 from '../assets/club-images/66407aec948f3c1ab2f82afa13ec7ae65c4e82a2.jpg'
import img3 from '../assets/club-images/036334c08b2d997cfeae95be364676f9baad1380.jpg'
import img4 from '../assets/club-images/7543246b68ef924572250e46ee747020720ef66f.jpg'
import img5 from '../assets/club-images/c3bc396dce7e72009a59c034cbe19ec2380aefaa.JPG'

const INTERVAL = 6000

const slides = [
  {
    category: 'Willkommen',
    short: 'TCT',
    label: 'Tennisclub Tulln',
    line1: 'Tennis Club',
    line2: 'Tulln',
    body: 'Leidenschaft für Tennis seit 1903 – Ihr Verein mitten in Niederösterreich.',
    image: img0,
    cta: { text: 'Verein entdecken', to: '/verein' },
  },
  {
    category: 'Tennis',
    short: 'Tennis',
    label: 'Die Sandplätze',
    line1: 'Tennis auf',
    line2: 'rotem Sand',
    body: 'Über 10 gepflegte Sandplätze – professionell saniert für die Saison 2026.',
    image: img1,
    cta: { text: 'Platz buchen', href: 'https://www.etennis.at/tc-tulln', external: true },
  },
  {
    category: 'Anlage',
    short: 'Anlage',
    label: 'Das Clubhaus',
    line1: 'Unser',
    line2: 'Vereinsheim',
    body: 'Moderne Infrastruktur und das neue Clublokal ab Mai 2026.',
    image: img2,
    cta: { text: 'Anlage entdecken', to: '/#anlage' },
  },
  {
    category: 'Ganzjährig',
    short: 'Halle',
    label: 'Die Halle',
    line1: 'Tennis',
    line2: '365 Tage',
    body: 'Unsere moderne Tennishalle ermöglicht ganzjähriges Spielen auf höchstem Niveau.',
    image: img3,
    cta: { text: 'Mehr erfahren', to: '/#anlage' },
  },
  {
    category: 'Mannschaft',
    short: 'Teams',
    label: 'Die Teams',
    line1: 'Spielen &',
    line2: 'Gewinnen',
    body: '5 Mannschaften im Ligabetrieb – Damen, Herren und Jugend.',
    image: img4,
    cta: { text: 'Teams ansehen', to: '/#teams' },
  },
  {
    category: 'Mitglied',
    short: 'Mitglied',
    label: 'Teil des Clubs',
    line1: 'Werde Teil',
    line2: 'unseres Clubs',
    body: 'Für alle Altersgruppen. Frühbucher-Rabatt bis 30. April.',
    image: img5,
    cta: { text: 'Mitglied werden', to: '/#mitgliedschaft' },
  },
]

const current = ref(0)
let timer = null

function goTo(i) {
  current.value = i
  restart()
}

function advance() {
  current.value = (current.value + 1) % slides.length
}

function restart() {
  clearInterval(timer)
  timer = setInterval(advance, INTERVAL)
}

onMounted(() => restart())
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <section class="hero">
    <!-- Background images — cross-fade between slides -->
    <div
      v-for="(s, i) in slides"
      :key="i"
      class="hero__bg"
      :class="{ 'hero__bg--active': i === current }"
      :style="{ backgroundImage: `url(${s.image})` }"
    />

    <div class="hero__vignette" />

    <!-- Slide content -->
    <div class="hero__stage container">
      <Transition name="fade-up" mode="out-in">
        <div :key="current" class="hero__text">
          <span class="hero__cat">{{ slides[current].category }}</span>
          <h1 class="hero__title">
            {{ slides[current].line1 }}<br>
            <em>{{ slides[current].line2 }}</em>
          </h1>
          <p class="hero__sub">{{ slides[current].body }}</p>
          <div class="hero__actions">
            <a
              v-if="slides[current].cta.external"
              :href="slides[current].cta.href"
              target="_blank"
              rel="noopener"
              class="btn btn--outline-white"
            >{{ slides[current].cta.text }}</a>
            <RouterLink
              v-else
              :to="slides[current].cta.to"
              class="btn btn--outline-white"
            >{{ slides[current].cta.text }}</RouterLink>
          </div>
        </div>
      </Transition>
    </div>

    <!-- MCCC-style category tab navigation -->
    <nav class="hero__nav" aria-label="Slide-Navigation">
      <div class="container">
        <div class="hero__nav-row">
          <button
            v-for="(s, i) in slides"
            :key="i"
            class="hero__nav-btn"
            :class="{ 'hero__nav-btn--active': i === current }"
            @click="goTo(i)"
          >
            <span v-if="i === current" class="hero__nav-fill" />
            <span class="hero__nav-cat hero__nav-cat--full">{{ s.category }}</span>
            <span class="hero__nav-cat hero__nav-cat--short">{{ s.short }}</span>
            <span class="hero__nav-label">{{ s.label }}</span>
          </button>
        </div>
      </div>
    </nav>
  </section>
</template>

<style scoped>
/* ── Shell ── */
.hero {
  position: relative;
  height: 100svh;
  min-height: 580px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* ── Background layers ── */
.hero__bg {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1);
  will-change: opacity;
}

.hero__bg--active { opacity: 1; }

.hero__vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    155deg,
    rgba(9, 21, 32, 0.80) 0%,
    rgba(9, 21, 32, 0.45) 55%,
    rgba(0, 0, 0, 0.15) 100%
  );
  z-index: 1;
}

/* ── Content ── */
.hero__stage {
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  align-items: center;
  padding-top: 9rem;
  padding-bottom: 2rem;
}

.hero__text { max-width: 620px; }

.hero__cat {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--blue-light);
  margin-bottom: 1.25rem;
}

.hero__title {
  font-family: var(--font-serif);
  font-size: clamp(3.5rem, 8.5vw, 7.5rem);
  font-weight: 600;
  color: var(--white);
  line-height: 0.93;
  letter-spacing: -0.02em;
  margin-bottom: 1.5rem;
}

.hero__title em {
  font-style: italic;
  color: var(--blue-light);
}

.hero__sub {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.75;
  margin-bottom: 2.5rem;
  max-width: 44ch;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* ── MCCC bottom nav ── */
.hero__nav {
  position: relative;
  z-index: 3;
  background: rgba(8, 18, 30, 0.75);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.hero__nav-row {
  display: flex;
}

.hero__nav-btn {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  padding: 1.2rem 1.75rem 1.4rem;
  background: none;
  border: none;
  border-right: 1px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  transition: background 0.25s ease;
}

.hero__nav-btn:last-child { border-right: none; }

.hero__nav-btn:hover,
.hero__nav-btn--active {
  background: rgba(255, 255, 255, 0.06);
}

/* Progress fill — created fresh each time the slide becomes active */
.hero__nav-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: var(--clay);
  animation: nav-fill 6s linear forwards;
}

@keyframes nav-fill {
  from { width: 0; }
  to   { width: 100%; }
}

.hero__nav-cat {
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
  transition: color 0.25s;
}

.hero__nav-btn--active .hero__nav-cat,
.hero__nav-btn:hover .hero__nav-cat { color: var(--white); }

.hero__nav-label {
  font-family: var(--font-serif);
  font-size: 0.9rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.3);
  transition: color 0.25s;
  line-height: 1.2;
}

.hero__nav-btn--active .hero__nav-label,
.hero__nav-btn:hover .hero__nav-label { color: rgba(255, 255, 255, 0.9); }

/* ── Vue transition ── */
.fade-up-enter-active {
  transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}
.fade-up-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.fade-up-enter-from { opacity: 0; transform: translateY(22px); }
.fade-up-leave-to   { opacity: 0; transform: translateY(-10px); }

/* ── Responsive ── */

/* Short label hidden on desktop; full label visible */
.hero__nav-cat--short { display: none; }

@media (max-width: 900px) {
  .hero__nav-row { overflow-x: visible; }
  .hero__nav-btn {
    flex: 1 1 0;
    min-width: 0;
    padding: 0.9rem 0.5rem 1.1rem;
    align-items: center;
  }
  /* Swap to short labels so 6 tabs fit cleanly */
  .hero__nav-cat--full  { display: none; }
  .hero__nav-cat--short { display: block; font-size: 0.62rem; letter-spacing: 0.13em; }
  .hero__nav-label { font-size: 0.78rem; }
}

@media (max-width: 768px) {
  .hero__stage { padding-top: 6.5rem; }
  .hero__nav-label { display: none; }
  .hero__nav-btn { padding: 0.9rem 0.35rem; }
}

@media (max-width: 480px) {
  .hero__actions { flex-direction: column; }
  .hero__actions .btn { width: 100%; justify-content: center; }
  .hero__nav-btn { padding: 0.85rem 0.2rem; }
  .hero__nav-cat--short { font-size: 0.55rem; letter-spacing: 0.06em; }
}
</style>
