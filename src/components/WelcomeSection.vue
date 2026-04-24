<script setup>
import courtImg from '../assets/club-images/7543246b68ef924572250e46ee747020720ef66f.jpg'
</script>

<template>
  <section class="welcome">
    <div class="container">
      <div class="welcome__grid">

        <!-- Left: heading + image -->
        <div class="welcome__left">
          <span class="section__label">Seit 1903</span>
          <div class="divider"></div>
          <h2 class="welcome__title">
            Herzlich willkommen<br>beim <em>Tennis Club Tulln</em>
          </h2>
          <div class="welcome__img-wrap">
            <img :src="courtImg" alt="Tennisanlage TC Tulln" loading="lazy" />
          </div>
        </div>

        <!-- Right: body + stats + CTA -->
        <div class="welcome__right">
          <p class="welcome__body">
            Der Tennis Club Tulln ist einer der traditionsreichsten Tennisvereine Niederösterreichs.
            Auf unserer modernen Anlage mit Außen- und Hallenplätzen bieten wir erstklassige
            Bedingungen – für Freizeitspieler ebenso wie für ambitionierte Wettkampfspieler.
          </p>
          <p class="welcome__body">
            Gegründet im Jahr 1903, blicken wir auf über 120 Jahre Leidenschaft für den Tennissport zurück.
            Wir heißen Spielerinnen und Spieler aller Altersgruppen herzlich willkommen – als Teil
            einer lebendigen Gemeinschaft mitten in Tulln an der Donau.
          </p>

          <div class="welcome__facts">
            <div class="welcome__fact">
              <span class="welcome__fact-num">1903</span>
              <span class="welcome__fact-lbl">Gegründet</span>
            </div>
            <div class="welcome__fact-sep"></div>
            <div class="welcome__fact">
              <span class="welcome__fact-num">10<sup>+</sup></span>
              <span class="welcome__fact-lbl">Sandplätze</span>
            </div>
            <div class="welcome__fact-sep"></div>
            <div class="welcome__fact">
              <span class="welcome__fact-num">5</span>
              <span class="welcome__fact-lbl">Mannschaften</span>
            </div>
          </div>

          <RouterLink to="/verein" class="btn btn--outline">
            Über den Verein
          </RouterLink>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
.welcome {
  padding: 6rem 0;
  background: var(--white);
}

.welcome__grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: start;
}

.welcome__title {
  font-family: var(--font-serif);
  font-size: clamp(1.9rem, 3vw, 2.8rem);
  font-weight: 600;
  line-height: 1.1;
  color: var(--black);
  margin-bottom: 2.5rem;
}

.welcome__title em {
  font-style: italic;
  color: var(--blue);
}

.welcome__img-wrap {
  overflow: hidden;
  aspect-ratio: 4 / 3;
}

.welcome__img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.6s ease;
}

.welcome__img-wrap:hover img {
  transform: scale(1.03);
}

.welcome__body {
  font-size: 1rem;
  color: var(--muted);
  line-height: 1.8;
  margin-bottom: 1.5rem;
  max-width: 52ch;
}

.welcome__facts {
  display: flex;
  align-items: center;
  gap: 0;
  padding: 2rem 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  margin-bottom: 2.5rem;
}

.welcome__fact {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  padding: 0 1.5rem;
}

.welcome__fact:first-child {
  padding-left: 0;
}

.welcome__fact-sep {
  width: 1px;
  height: 2.5rem;
  background: var(--border);
  flex-shrink: 0;
}

.welcome__fact-num {
  font-family: var(--font-serif);
  font-size: 2rem;
  font-weight: 700;
  color: var(--black);
  line-height: 1;
  letter-spacing: -0.02em;
}

.welcome__fact-num sup {
  font-size: 0.5em;
  font-weight: 600;
  color: var(--clay);
  vertical-align: super;
  line-height: 0;
}

.welcome__fact-lbl {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

@media (max-width: 900px) {
  .welcome__grid {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .welcome { padding: 4rem 0; }
  .welcome__facts { gap: 0; }
  .welcome__fact { padding: 0 1rem; }
}
</style>
