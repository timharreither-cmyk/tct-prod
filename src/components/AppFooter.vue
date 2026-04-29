<script setup>
const currentYear = new Date().getFullYear()

const quickLinks = [
  { label: 'News', to: '/news' },
  { label: 'Anlage', to: '/#anlage' },
  { label: 'Teams', to: '/#teams' },
  { label: 'Mitgliedschaft', to: '/#mitgliedschaft' },
  { label: 'Tennisschule', to: '/#tennisschule' },
]

const externalLinks = [
  { label: 'Platzbuchung', href: 'https://www.tc-tulln.at/reservierung' },
  { label: 'Tennisschule Christian Wolf', href: 'https://christianwolf.at' },
  { label: 'Tennis Austria', href: 'https://www.tennisaustria.at' },
  { label: 'NÖ Tennisverband', href: '#' },
]
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__grid">
        <!-- Brand -->
        <div class="footer__brand">
          <RouterLink to="/" class="footer__logo">
            <img src="/TCT_Logo.jpg" alt="TCT Tennisclub Tulln" class="footer__logo-img" />
            <span class="footer__logo-full">Tennisclub Tulln</span>
          </RouterLink>
          <p class="footer__tagline">
            Leidenschaft für Tennis.<br>
            Gemeinschaft, die verbindet.
          </p>
          <div class="footer__court-icon" aria-hidden="true">
            <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
              <rect x="5" y="5" width="110" height="70" fill="none" stroke="currentColor" stroke-width="1" opacity="0.2"/>
              <line x1="60" y1="5" x2="60" y2="75" stroke="currentColor" stroke-width="0.8" opacity="0.2"/>
              <line x1="5" y1="40" x2="115" y2="40" stroke="currentColor" stroke-width="0.8" opacity="0.15"/>
              <line x1="25" y1="5" x2="25" y2="75" stroke="currentColor" stroke-width="0.6" opacity="0.1"/>
              <line x1="95" y1="5" x2="95" y2="75" stroke="currentColor" stroke-width="0.6" opacity="0.1"/>
            </svg>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer__col">
          <h4 class="footer__col-title">Navigation</h4>
          <nav class="footer__nav">
            <RouterLink v-for="l in quickLinks" :key="l.label" :to="l.to" class="footer__link">
              {{ l.label }}
            </RouterLink>
            <RouterLink to="/kontakt" class="footer__link">Kontakt</RouterLink>
          </nav>
        </div>

        <!-- External Links -->
        <div class="footer__col">
          <h4 class="footer__col-title">Externe Links</h4>
          <nav class="footer__nav">
            <a v-for="l in externalLinks" :key="l.label" :href="l.href" target="_blank" rel="noopener" class="footer__link">
              {{ l.label }}
            </a>
          </nav>
        </div>

        <!-- Contact mini -->
        <div class="footer__col">
          <h4 class="footer__col-title">Kontakt</h4>
          <div class="footer__contact">
            <p>Tennisclub Tulln<br>Tulln an der Donau<br>Niederösterreich</p>
            <a href="mailto:office@tc-tulln.at" class="footer__link footer__link--email">office@tc-tulln.at</a>
            <a href="https://www.tc-tulln.at/reservierung" target="_blank" rel="noopener" class="btn btn--outline footer__book-btn">
              Platz buchen
            </a>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <p class="footer__copy">© {{ currentYear }} Tennisclub Tulln. Alle Rechte vorbehalten.</p>
        <p class="footer__sub">Technisch realisiert mit Vue.js &amp; Vite</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--black);
  color: rgba(255,255,255,0.6);
  padding: 5rem 0 2rem;
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr 1fr;
  gap: 3rem;
  padding-bottom: 4rem;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.footer__brand {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer__logo {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.footer__logo-img {
  height: 2.2rem;
  width: auto;
  object-fit: contain;
}

.footer__logo-full {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
}

.footer__tagline {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.4);
  line-height: 1.6;
}

.footer__court-icon {
  width: 80px;
  color: var(--white);
  margin-top: 1rem;
  opacity: 0.4;
}

.footer__col-title {
  font-family: var(--font-sans);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.3);
  margin-bottom: 1.5rem;
}

.footer__nav {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer__link {
  font-size: 0.88rem;
  color: rgba(255,255,255,0.55);
  text-decoration: none;
  transition: color var(--transition);
}

.footer__link:hover {
  color: var(--white);
}

.footer__link--email {
  display: inline-block;
}

.footer__contact {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer__contact p {
  font-size: 0.88rem;
  line-height: 1.6;
}

.footer__book-btn {
  margin-top: 0.5rem;
  border-color: rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.6);
  font-size: 0.72rem;
  padding: 0.65rem 1.25rem;
}

.footer__book-btn:hover {
  border-color: var(--white);
  color: var(--white);
  background-color: transparent;
}

.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.footer__copy {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.25);
}

.footer__sub {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.18);
}

@media (max-width: 900px) {
  .footer__grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 550px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
