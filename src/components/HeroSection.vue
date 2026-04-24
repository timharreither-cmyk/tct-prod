<script setup>
import heroBg from '../assets/club-images/66407aec948f3c1ab2f82afa13ec7ae65c4e82a2.jpg'
</script>

<template>
  <section class="hero" :style="{ backgroundImage: `url(${heroBg})` }">
    <div class="hero__content container">
      <div class="hero__text fade-up">
        <span class="hero__label">Willkommen beim</span>
        <h1 class="hero__title">Tennis<br><em>Club</em> Tulln</h1>
        <p class="hero__sub">
          Leidenschaft für Tennis seit Jahrzehnten.<br>
          Niederösterreichs lebendiger Tennisverein.
        </p>
        <div class="hero__actions fade-up fade-up-delay-2">
          <a href="https://www.etennis.at/tc-tulln" target="_blank" rel="noopener" class="btn btn--primary">
            Platz buchen
          </a>
          <RouterLink to="/#mitgliedschaft" class="btn btn--outline-white">
            Mitglied werden
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="hero__stats">
      <div class="container">
        <div class="hero__stats-grid">
          <div class="hero__stat">
            <span class="hero__stat-number">10+</span>
            <span class="hero__stat-label">Plätze</span>
          </div>
          <div class="hero__stat">
            <span class="hero__stat-number">5</span>
            <span class="hero__stat-label">Mannschaften</span>
          </div>
          <div class="hero__stat">
            <span class="hero__stat-number">1</span>
            <span class="hero__stat-label">Tennishalle</span>
          </div>
          <div class="hero__stat">
            <span class="hero__stat-number">∞</span>
            <span class="hero__stat-label">Begeisterung</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  min-height: 100svh;
  background-color: var(--blue-dark);
  background-size: cover;
  background-position: center;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(160deg, rgba(9, 21, 32, 0.88) 0%, rgba(13, 32, 64, 0.75) 50%, rgba(26, 114, 216, 0.3) 100%);
  z-index: 1;
}

.hero__content {
  position: relative;
  z-index: 3;
  padding-top: 8rem;
  padding-bottom: 4rem;
}

.hero__label {
  display: block;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--blue-light);
  margin-bottom: 1.5rem;
}

.hero__title {
  font-family: var(--font-serif);
  font-size: clamp(3.5rem, 10vw, 7.5rem);
  font-weight: 600;
  color: var(--white);
  line-height: 0.95;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
}

.hero__title em {
  font-style: italic;
  color: var(--blue-light);
}

.hero__sub {
  font-size: 1.05rem;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.7;
  margin-bottom: 2.5rem;
  max-width: 40ch;
}

.hero__actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.hero__stats {
  position: relative;
  z-index: 3;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background-color: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(4px);
}

.hero__stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 2rem 0;
}

.hero__stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.25rem;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.hero__stat:last-child {
  border-right: none;
}

.hero__stat-number {
  font-family: var(--font-serif);
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--white);
  line-height: 1;
}

.hero__stat-label {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 0.4rem;
}

@media (max-width: 768px) {
  .hero__content {
    padding-top: 5.5rem;
    padding-bottom: 2.5rem;
  }

  .hero__sub {
    font-size: 0.95rem;
  }
}

@media (max-width: 600px) {
  .hero__stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero__stat:nth-child(2) {
    border-right: none;
  }
  .hero__stat:nth-child(3) {
    border-top: 1px solid rgba(255,255,255,0.08);
  }
  .hero__stat:nth-child(4) {
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .hero__stat-number {
    font-size: 2rem;
  }

  .hero__actions {
    flex-direction: column;
  }

  .hero__actions .btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
