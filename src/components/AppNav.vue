<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const menuOpen = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 60
}

onMounted(() => window.addEventListener('scroll', onScroll))
onUnmounted(() => window.removeEventListener('scroll', onScroll))

const navLinks = [
  { label: 'News', to: '/news' },
  { label: 'Verein', to: '/verein' },
  { label: 'Anlage', to: '/#anlage' },
  { label: 'Teams', to: '/#teams' },
  { label: 'Mitgliedschaft', to: '/#mitgliedschaft' },
  { label: 'Tennisschule', to: '/#tennisschule' },
  { label: 'Kontakt', to: '/kontakt' },
]
</script>

<template>
  <header class="nav" :class="{ 'nav--scrolled': scrolled, 'nav--open': menuOpen }">
    <div class="nav__inner">
      <RouterLink to="/" class="nav__logo" @click="menuOpen = false">
        <img src="/TCT_Logo.jpg" alt="TCT Tennisclub Tulln" class="nav__logo-img" />
        <span class="nav__logo-full">Tennisclub Tulln</span>
      </RouterLink>

      <nav class="nav__links">
        <RouterLink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="nav__link"
        >
          {{ link.label }}
        </RouterLink>
        <a
          href="https://www.etennis.at/tc-tulln"
          target="_blank"
          rel="noopener"
          class="btn btn--primary nav__cta"
        >
          Platz buchen
        </a>
      </nav>

      <button class="nav__burger" :aria-expanded="menuOpen" aria-label="Menü" @click="menuOpen = !menuOpen">
        <span></span><span></span><span></span>
      </button>
    </div>

    <nav class="nav__mobile" :class="{ 'nav__mobile--open': menuOpen }">
      <RouterLink
        v-for="link in navLinks"
        :key="link.label"
        :to="link.to"
        class="nav__mobile-link"
        @click="menuOpen = false"
      >
        {{ link.label }}
      </RouterLink>
      <a
        href="https://www.etennis.at/tc-tulln"
        target="_blank"
        rel="noopener"
        class="btn btn--primary"
        style="margin-top: 1rem; width: 100%; justify-content: center"
      >
        Platz buchen
      </a>
    </nav>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: transparent;
  transition: background-color 0.4s ease, box-shadow 0.4s ease;
}

.nav--scrolled {
  background-color: rgba(240, 244, 251, 0.97);
  backdrop-filter: blur(12px);
  box-shadow: 0 1px 0 var(--border);
}

.nav--open {
  background-color: var(--bg);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 2rem;
  max-width: 1280px;
  margin: 0 auto;
}

.nav__logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
}

.nav__logo-img {
  height: 38px;
  width: 38px;
  object-fit: contain;
  border-radius: 4px;
  opacity: 0.92;
  transition: opacity var(--transition);
}

.nav--scrolled .nav__logo-img,
.nav--open .nav__logo-img {
  opacity: 1;
}

.nav__logo-full {
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
}

.nav--scrolled .nav__logo-full,
.nav--open .nav__logo-full {
  color: var(--black);
  opacity: 0.7;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav__link {
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.8);
  transition: color var(--transition);
  text-decoration: none;
}

.nav__link:hover,
.nav__link.router-link-active {
  color: #fff;
}

.nav--scrolled .nav__link,
.nav--open .nav__link {
  color: rgba(17, 17, 17, 0.7);
}

.nav--scrolled .nav__link:hover,
.nav--scrolled .nav__link.router-link-active {
  color: var(--black);
}

.nav__cta {
  padding: 0.65rem 1.4rem;
  font-size: 0.72rem;
}

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 4px;
  background: none;
  border: none;
  cursor: pointer;
}

.nav__burger span {
  display: block;
  width: 24px;
  height: 1.5px;
  background-color: #fff;
  transition: var(--transition);
}

.nav--scrolled .nav__burger span,
.nav--open .nav__burger span {
  background-color: var(--black);
}

.nav__mobile {
  display: none;
  flex-direction: column;
  background-color: var(--bg);
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s ease;
}

.nav__mobile--open {
  max-height: 500px;
  padding: 1.5rem 2rem 2rem;
  border-top: 1px solid var(--border);
}

.nav__mobile-link {
  font-size: 1rem;
  font-weight: 500;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
  text-decoration: none;
  color: var(--black);
  letter-spacing: 0.05em;
}

@media (max-width: 900px) {
  .nav__links { display: none; }
  .nav__burger { display: flex; }
  .nav__mobile { display: flex; }
  .nav--scrolled { background-color: var(--bg); }
}
</style>
