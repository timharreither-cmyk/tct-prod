<script setup>
import { ref } from 'vue'
import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const AUTOREPLY_ID = import.meta.env.VITE_EMAILJS_AUTOREPLY_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

const form = ref({
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: '',
})

const subjects = [
  'Mitgliedschaft anfragen',
  'Platzreservierung',
  'Tennisschule',
  'Sponsoring & Partnerschaft',
  'Allgemeine Anfrage',
]

const status = ref('idle') // idle | sending | success | error

async function submit() {
  if (status.value === 'sending') return
  status.value = 'sending'

  const params = {
    from_name: form.value.name,
    from_email: form.value.email,
    phone: form.value.phone || '—',
    subject: form.value.subject,
    message: form.value.message,
    to_name: 'TC Tulln',
    reply_to: form.value.email,
  }

  try {
    await emailjs.send(SERVICE_ID, TEMPLATE_ID, params, PUBLIC_KEY)
    // Send auto-reply to user
    await emailjs.send(SERVICE_ID, AUTOREPLY_ID, {
      ...params,
      to_name: form.value.name,
      to_email: form.value.email,
    }, PUBLIC_KEY)
    status.value = 'success'
    form.value = { name: '', email: '', phone: '', subject: '', message: '' }
  } catch {
    status.value = 'error'
  }
}

function reset() {
  status.value = 'idle'
}
</script>

<template>
  <section class="section section--dark" id="kontakt">
    <div class="container">
      <div class="contact__grid">
        <!-- Info side -->
        <div class="contact__info">
          <span class="section__label">Kontakt</span>
          <div class="divider"></div>
          <h2 class="section__title contact__title">Schreiben Sie<br><em>uns an</em></h2>

          <div class="contact__details">
            <div class="contact__detail">
              <svg class="contact__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div>
                <span class="contact__detail-label">Adresse</span>
                <span class="contact__detail-value">Tennisclub Tulln<br>Tulln an der Donau, Niederösterreich</span>
              </div>
            </div>

            <div class="contact__detail">
              <svg class="contact__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              <div>
                <span class="contact__detail-label">E-Mail</span>
                <a href="mailto:office@tc-tulln.at" class="contact__detail-value contact__link">office@tc-tulln.at</a>
              </div>
            </div>

            <div class="contact__detail">
              <svg class="contact__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.33a2 2 0 0 1 2-2.19h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              <div>
                <span class="contact__detail-label">Website</span>
                <a href="https://www.tc-tulln.at" target="_blank" rel="noopener" class="contact__detail-value contact__link">www.tc-tulln.at</a>
              </div>
            </div>

            <div class="contact__detail">
              <svg class="contact__icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <div>
                <span class="contact__detail-label">Buchungssystem</span>
                <a href="https://www.tc-tulln.at/reservierung" target="_blank" rel="noopener" class="contact__detail-value contact__link">Platzbuchung</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Form side -->
        <div class="contact__form-wrap">
          <form v-if="status !== 'success'" class="contact__form" @submit.prevent="submit" novalidate>
            <div class="form__row">
              <div class="form__group">
                <label class="form__label" for="name">Name *</label>
                <input
                  id="name"
                  v-model="form.name"
                  type="text"
                  class="form__input"
                  placeholder="Ihr vollständiger Name"
                  required
                  autocomplete="name"
                />
              </div>
              <div class="form__group">
                <label class="form__label" for="email">E-Mail *</label>
                <input
                  id="email"
                  v-model="form.email"
                  type="email"
                  class="form__input"
                  placeholder="ihre@email.at"
                  required
                  autocomplete="email"
                />
              </div>
            </div>

            <div class="form__row">
              <div class="form__group">
                <label class="form__label" for="phone">Telefon</label>
                <input
                  id="phone"
                  v-model="form.phone"
                  type="tel"
                  class="form__input"
                  placeholder="+43 ..."
                  autocomplete="tel"
                />
              </div>
              <div class="form__group">
                <label class="form__label" for="subject">Betreff *</label>
                <select id="subject" v-model="form.subject" class="form__input" required>
                  <option value="" disabled>Bitte wählen...</option>
                  <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
                </select>
              </div>
            </div>

            <div class="form__group">
              <label class="form__label" for="message">Nachricht *</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form__input form__textarea"
                placeholder="Ihre Nachricht an uns..."
                rows="5"
                required
              ></textarea>
            </div>

            <div class="form__footer">
              <p class="form__note">* Pflichtfelder. Sie erhalten eine automatische Bestätigung per E-Mail.</p>
              <button
                type="submit"
                class="btn btn--primary form__submit"
                :disabled="status === 'sending'"
              >
                <span v-if="status !== 'sending'">
                  Nachricht senden
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </span>
                <span v-else>Wird gesendet…</span>
              </button>
            </div>

            <div v-if="status === 'error'" class="form__error">
              Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder senden Sie uns direkt eine E-Mail.
              <button class="form__error-reset" @click="reset">Erneut versuchen</button>
            </div>
          </form>

          <!-- Success state -->
          <div v-else class="contact__success">
            <div class="contact__success-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3>Vielen Dank!</h3>
            <p>Ihre Nachricht wurde erfolgreich übermittelt. Sie erhalten in Kürze eine Bestätigung per E-Mail. Wir melden uns schnellstmöglich bei Ihnen.</p>
            <button class="btn btn--outline-white" style="margin-top: 1.5rem" @click="reset">
              Neue Nachricht
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.contact__grid {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 6rem;
  align-items: start;
}

.contact__title em {
  font-style: italic;
  color: var(--blue-light);
}

.contact__details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2.5rem;
}

.contact__detail {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.contact__icon {
  color: var(--blue);
  flex-shrink: 0;
  margin-top: 2px;
}

.contact__detail-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
  margin-bottom: 0.3rem;
}

.contact__detail-value {
  font-size: 0.92rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.5;
}

.contact__link {
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color var(--transition);
}

.contact__link:hover {
  color: var(--blue-light);
}

/* Form */
.contact__form-wrap {
  background-color: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.08);
  padding: 2.5rem;
}

.contact__form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form__group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form__label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}

.form__input {
  background-color: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.12);
  color: var(--white);
  padding: 0.85rem 1rem;
  font-size: 0.9rem;
  outline: none;
  transition: border-color var(--transition), background-color var(--transition);
  width: 100%;
  -webkit-appearance: none;
  appearance: none;
}

.form__input::placeholder {
  color: rgba(255,255,255,0.25);
}

.form__input option {
  background-color: var(--bg-dark);
  color: var(--white);
}

.form__input:focus {
  border-color: var(--blue);
  background-color: rgba(255,255,255,0.08);
}

.form__textarea {
  resize: vertical;
  min-height: 120px;
  font-size: 0.9rem;
  line-height: 1.5;
}

.form__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.form__note {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.3);
  line-height: 1.5;
}

.form__submit {
  white-space: nowrap;
}

.form__submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.form__error {
  background-color: rgba(196, 82, 42, 0.15);
  border: 1px solid rgba(196, 82, 42, 0.4);
  padding: 1rem;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.7);
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.form__error-reset {
  color: var(--blue-light);
  font-weight: 600;
  font-size: 0.8rem;
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;
}

/* Success state */
.contact__success {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  gap: 1rem;
}

.contact__success-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 1.5px solid var(--blue);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--blue);
  margin-bottom: 0.5rem;
}

.contact__success h3 {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  color: var(--white);
}

.contact__success p {
  font-size: 0.9rem;
  color: rgba(255,255,255,0.55);
  line-height: 1.7;
  max-width: 40ch;
}

@media (max-width: 900px) {
  .contact__grid { grid-template-columns: 1fr; gap: 3rem; }
  .form__row { grid-template-columns: 1fr; }
  .contact__form-wrap { padding: 1.5rem; }
}

@media (max-width: 480px) {
  .form__footer {
    flex-direction: column;
    align-items: stretch;
  }

  .form__submit {
    width: 100%;
    justify-content: center;
  }
}
</style>
