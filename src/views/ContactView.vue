<script setup>
import ContactSection from '../components/ContactSection.vue'
</script>

<template>
  <div class="contact-page">
    <div class="contact-page__header">
      <div class="container">
        <span class="section__label">TC Tulln</span>
        <div class="divider" style="background-color: var(--blue-light)"></div>
        <h1 class="contact-page__title">Kontakt</h1>
        <p class="contact-page__sub">Wir freuen uns auf Ihre Nachricht – für Mitgliedschaftsanfragen, Informationen oder einfach Hallo.</p>
      </div>
    </div>
    <ContactSection />
  </div>
</template>

<style scoped>
.contact-page__header {
  background-color: var(--bg-dark);
  padding: 8rem 0 4rem;
  color: var(--white);
}

.contact-page__title {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 6vw, 4.5rem);
  font-weight: 600;
  color: var(--white);
  line-height: 1.05;
  margin-bottom: 1rem;
}

.contact-page__sub {
  font-size: 1rem;
  color: rgba(255,255,255,0.5);
  max-width: 50ch;
}
</style>
