<script setup>
import { ref, computed } from 'vue'
import { adminPosts, savePost, updatePost, deletePost, uploadFile } from '../data/posts.js'
import { adminEvents, saveEvent, updateEvent, deleteEvent } from '../data/events.js'
import MarkdownEditor from '../components/MarkdownEditor.vue'

// ── Auth ──────────────────────────────────────────────────────────────────────
const ADMIN_USER = import.meta.env.VITE_ADMIN_USER || 'admin'
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'tct-admin'
const AUTH_KEY = 'tct_admin_auth'

const isLoggedIn = ref(sessionStorage.getItem(AUTH_KEY) === '1')
const loginUser = ref('')
const loginPass = ref('')
const loginError = ref('')

function login() {
  if (loginUser.value === ADMIN_USER && loginPass.value === ADMIN_PASS) {
    sessionStorage.setItem(AUTH_KEY, '1')
    isLoggedIn.value = true
    loginError.value = ''
  } else {
    loginError.value = 'Ungültige Anmeldedaten.'
  }
}

function logout() {
  sessionStorage.removeItem(AUTH_KEY)
  isLoggedIn.value = false
  loginUser.value = ''
  loginPass.value = ''
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
const activeTab = ref('posts')

// ── Global messages ───────────────────────────────────────────────────────────
const successMsg = ref('')
const errorMsg = ref('')

function flashSuccess(msg) {
  successMsg.value = msg
  setTimeout(() => { successMsg.value = '' }, 4000)
}

function flashError(msg) {
  errorMsg.value = msg
  setTimeout(() => { errorMsg.value = '' }, 5000)
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-AT', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

// ── Post form ─────────────────────────────────────────────────────────────────
const CATEGORIES = ['Events', 'Clublokal', 'Anlage', 'Jugend', 'Allgemein']

const postForm = ref(emptyPostForm())
const editingPostId = ref(null)
const savingPost = ref(false)
const postSearch = ref('')

function emptyPostForm() {
  return {
    title: '',
    slug: '',
    category: 'Events',
    date: new Date().toISOString().slice(0, 10),
    excerpt: '',
    content: '',
    featured: false,
    _slugEdited: false,
  }
}

function onTitleInput(e) {
  if (!postForm.value._slugEdited) {
    postForm.value.slug = slugify(e.target.value)
  }
}

function onSlugInput() {
  postForm.value._slugEdited = true
}

const filteredPosts = computed(() => {
  const q = postSearch.value.trim().toLowerCase()
  if (!q) return adminPosts.value
  return adminPosts.value.filter(p =>
    p.title.toLowerCase().includes(q) ||
    p.excerpt.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q)
  )
})

async function submitPost() {
  const { title, slug, category, date, excerpt, content, featured } = postForm.value
  if (!title || !slug || !excerpt || !content) return

  savingPost.value = true
  try {
    const payload = { slug, title, date, category, excerpt, content, image: null, featured }
    if (editingPostId.value) {
      await updatePost(editingPostId.value, payload)
      flashSuccess('Beitrag wurde aktualisiert.')
    } else {
      await savePost(payload)
      flashSuccess('Beitrag wurde gespeichert.')
    }
    resetPostForm()
  } catch {
    flashError('Fehler beim Speichern. Ist der Server erreichbar?')
  } finally {
    savingPost.value = false
  }
}

function onUploadError() {
  flashError('Datei-Upload fehlgeschlagen.')
}

function editPost(p) {
  editingPostId.value = p.id
  postForm.value = {
    title: p.title,
    slug: p.slug,
    category: p.category || 'Events',
    date: p.date,
    excerpt: p.excerpt,
    content: p.content,
    featured: !!p.featured,
    _slugEdited: true,
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetPostForm() {
  editingPostId.value = null
  postForm.value = emptyPostForm()
}

async function removePost(p) {
  if (!window.confirm(`Beitrag "${p.title}" wirklich löschen?`)) return
  try {
    await deletePost(p.id)
    if (editingPostId.value === p.id) resetPostForm()
    flashSuccess('Beitrag gelöscht.')
  } catch {
    flashError('Löschen fehlgeschlagen.')
  }
}

// ── Event form ────────────────────────────────────────────────────────────────
const EVENT_TAGS = ['Event', 'Turnier', 'Clublokal', 'Jugend', 'Anlage', 'Training']

const eventForm = ref(emptyEventForm())
const editingEventId = ref(null)
const savingEvent = ref(false)

function emptyEventForm() {
  return {
    title: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    time: '',
    location: 'TC Tulln Anlage',
    tag: 'Event',
  }
}

const sortedEvents = computed(() =>
  [...adminEvents.value].sort((a, b) => new Date(a.date) - new Date(b.date))
)

const upcomingEventCount = computed(() => {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return adminEvents.value.filter(e => new Date(e.date) >= now).length
})

function isPast(iso) {
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return new Date(iso) < now
}

async function submitEvent() {
  const { title, description, date, tag } = eventForm.value
  if (!title || !description || !date || !tag) return

  savingEvent.value = true
  try {
    if (editingEventId.value) {
      await updateEvent(editingEventId.value, eventForm.value)
      flashSuccess('Veranstaltung wurde aktualisiert.')
    } else {
      await saveEvent(eventForm.value)
      flashSuccess('Veranstaltung wurde gespeichert.')
    }
    resetEventForm()
  } catch {
    flashError('Fehler beim Speichern der Veranstaltung.')
  } finally {
    savingEvent.value = false
  }
}

function editEvent(e) {
  editingEventId.value = e.id
  eventForm.value = {
    title: e.title,
    description: e.description,
    date: e.date,
    time: e.time || '',
    location: e.location || '',
    tag: e.tag || 'Event',
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetEventForm() {
  editingEventId.value = null
  eventForm.value = emptyEventForm()
}

async function removeEvent(e) {
  if (!window.confirm(`Veranstaltung "${e.title}" wirklich löschen?`)) return
  try {
    await deleteEvent(e.id)
    if (editingEventId.value === e.id) resetEventForm()
    flashSuccess('Veranstaltung gelöscht.')
  } catch {
    flashError('Löschen fehlgeschlagen.')
  }
}

function switchTab(tab) {
  activeTab.value = tab
  resetPostForm()
  resetEventForm()
}
</script>

<template>
  <!-- ── Login ── -->
  <div v-if="!isLoggedIn" class="auth-page">
    <div class="auth-card">
      <div class="auth-logo">TCT</div>
      <h1 class="auth-title">Admin-Bereich</h1>
      <p class="auth-subtitle">Bitte melden Sie sich an.</p>
      <form class="auth-form" @submit.prevent="login">
        <div class="field">
          <label class="field__label" for="user">Benutzername</label>
          <input id="user" v-model="loginUser" type="text" class="field__input" autocomplete="username" required />
        </div>
        <div class="field">
          <label class="field__label" for="pass">Passwort</label>
          <input id="pass" v-model="loginPass" type="password" class="field__input" autocomplete="current-password" required />
        </div>
        <p v-if="loginError" class="auth-error">{{ loginError }}</p>
        <button type="submit" class="btn btn--primary btn--full">Anmelden</button>
      </form>
    </div>
  </div>

  <!-- ── Admin dashboard ── -->
  <div v-else class="admin-page">
    <header class="admin-header">
      <div class="container">
        <div class="admin-header__inner">
          <span class="admin-header__brand">TCT Admin</span>
          <nav class="admin-tabs">
            <button
              class="admin-tabs__btn"
              :class="{ 'admin-tabs__btn--active': activeTab === 'posts' }"
              @click="switchTab('posts')"
            >
              Beiträge
              <span class="admin-tabs__badge">{{ adminPosts.length }}</span>
            </button>
            <button
              class="admin-tabs__btn"
              :class="{ 'admin-tabs__btn--active': activeTab === 'events' }"
              @click="switchTab('events')"
            >
              Veranstaltungen
              <span class="admin-tabs__badge">{{ adminEvents.length }}</span>
            </button>
          </nav>
          <button class="btn btn--ghost btn--sm" @click="logout">Abmelden</button>
        </div>
      </div>
    </header>

    <main class="admin-main">
      <div class="container">

        <!-- Global messages -->
        <div v-if="successMsg" class="alert alert--success">{{ successMsg }}</div>
        <div v-if="errorMsg"   class="alert alert--error">{{ errorMsg }}</div>

        <!-- ═════ POSTS TAB ═════ -->
        <template v-if="activeTab === 'posts'">

          <!-- Post form -->
          <section class="admin-section">
            <div class="admin-section__head">
              <h2 class="admin-section__title">
                {{ editingPostId ? 'Beitrag bearbeiten' : 'Neuen Beitrag erstellen' }}
              </h2>
              <button
                v-if="editingPostId"
                type="button"
                class="btn btn--ghost btn--sm"
                @click="resetPostForm"
              >Bearbeitung abbrechen</button>
            </div>

            <div class="post-editor">
              <form class="post-form" @submit.prevent="submitPost">

                <div class="field">
                  <label class="field__label" for="f-title">Titel *</label>
                  <input id="f-title" v-model="postForm.title" type="text" class="field__input" @input="onTitleInput" required />
                </div>

                <div class="field-row">
                  <div class="field">
                    <label class="field__label" for="f-slug">Slug *</label>
                    <input id="f-slug" v-model="postForm.slug" type="text" class="field__input field__input--mono" @input="onSlugInput" required />
                  </div>
                  <div class="field">
                    <label class="field__label" for="f-date">Datum *</label>
                    <input id="f-date" v-model="postForm.date" type="date" class="field__input" required />
                  </div>
                </div>

                <div class="field">
                  <label class="field__label" for="f-cat">Kategorie</label>
                  <select id="f-cat" v-model="postForm.category" class="field__input">
                    <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
                  </select>
                </div>

                <div class="field">
                  <label class="field__label" for="f-excerpt">Teaser *</label>
                  <textarea id="f-excerpt" v-model="postForm.excerpt" class="field__input field__input--ta" rows="3" required />
                </div>

                <div class="field">
                  <label class="field__label">Inhalt (Markdown) *</label>
                  <MarkdownEditor
                    v-model="postForm.content"
                    :uploader="uploadFile"
                    @upload-error="onUploadError"
                  />
                </div>

                <label class="checkbox-field">
                  <input v-model="postForm.featured" type="checkbox" class="checkbox-field__input" />
                  <span>Als Featured-Beitrag markieren</span>
                </label>

                <div class="form-actions">
                  <button type="submit" class="btn btn--primary" :disabled="savingPost">
                    {{ savingPost ? 'Wird gespeichert…' : (editingPostId ? 'Änderungen speichern' : 'Beitrag speichern') }}
                  </button>
                  <button
                    v-if="editingPostId"
                    type="button"
                    class="btn btn--ghost"
                    @click="resetPostForm"
                  >Abbrechen</button>
                </div>
              </form>
            </div>
          </section>

          <!-- Published posts -->
          <section v-if="adminPosts.length" class="admin-section">
            <div class="admin-section__head">
              <h2 class="admin-section__title">Beiträge ({{ adminPosts.length }})</h2>
              <input
                v-model="postSearch"
                type="search"
                class="search-input"
                placeholder="Suchen…"
              />
            </div>
            <p class="admin-section__hint">Diese Beiträge sind auf dem Server gespeichert und für alle Besucher sichtbar.</p>
            <div class="item-list">
              <div v-for="p in filteredPosts" :key="p.id" class="item-list__item" :class="{ 'item-list__item--editing': editingPostId === p.id }">
                <div class="item-list__meta">
                  <span class="tag">{{ p.category }}</span>
                  <time>{{ formatDate(p.date) }}</time>
                  <span v-if="p.featured" class="badge badge--featured">Featured</span>
                </div>
                <div class="item-list__body">
                  <strong class="item-list__title">{{ p.title }}</strong>
                  <p class="item-list__desc">{{ p.excerpt }}</p>
                </div>
                <div class="item-list__actions">
                  <button class="btn btn--ghost btn--sm" @click="editPost(p)">Bearbeiten</button>
                  <RouterLink :to="`/news/${p.slug}`" class="btn btn--ghost btn--sm" target="_blank">Ansehen</RouterLink>
                  <button class="btn btn--danger btn--sm" @click="removePost(p)">Löschen</button>
                </div>
              </div>
              <div v-if="!filteredPosts.length" class="item-list__empty">
                Keine Treffer für „{{ postSearch }}".
              </div>
            </div>
          </section>

          <section v-else class="admin-section admin-section--empty">
            <p>Noch keine Beiträge auf dem Server gespeichert.</p>
          </section>
        </template>

        <!-- ═════ EVENTS TAB ═════ -->
        <template v-else-if="activeTab === 'events'">

          <section class="admin-section">
            <div class="admin-section__head">
              <h2 class="admin-section__title">
                {{ editingEventId ? 'Veranstaltung bearbeiten' : 'Neue Veranstaltung erstellen' }}
              </h2>
              <button
                v-if="editingEventId"
                type="button"
                class="btn btn--ghost btn--sm"
                @click="resetEventForm"
              >Bearbeitung abbrechen</button>
            </div>

            <p class="admin-section__hint">
              Veranstaltungen erscheinen im Bereich „Termine" auf der Startseite. Vergangene Termine werden automatisch ausgeblendet.
            </p>

            <form class="post-form" @submit.prevent="submitEvent">

              <div class="field">
                <label class="field__label" for="e-title">Titel *</label>
                <input id="e-title" v-model="eventForm.title" type="text" class="field__input" required />
              </div>

              <div class="field-row">
                <div class="field">
                  <label class="field__label" for="e-date">Datum *</label>
                  <input id="e-date" v-model="eventForm.date" type="date" class="field__input" required />
                </div>
                <div class="field">
                  <label class="field__label" for="e-time">Uhrzeit</label>
                  <input id="e-time" v-model="eventForm.time" type="text" class="field__input" placeholder="z. B. 10:00 Uhr" />
                </div>
              </div>

              <div class="field-row">
                <div class="field">
                  <label class="field__label" for="e-location">Ort</label>
                  <input id="e-location" v-model="eventForm.location" type="text" class="field__input" />
                </div>
                <div class="field">
                  <label class="field__label" for="e-tag">Kategorie</label>
                  <select id="e-tag" v-model="eventForm.tag" class="field__input">
                    <option v-for="t in EVENT_TAGS" :key="t" :value="t">{{ t }}</option>
                  </select>
                </div>
              </div>

              <div class="field">
                <label class="field__label" for="e-desc">Beschreibung *</label>
                <textarea id="e-desc" v-model="eventForm.description" class="field__input field__input--ta" rows="4" required />
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn--primary" :disabled="savingEvent">
                  {{ savingEvent ? 'Wird gespeichert…' : (editingEventId ? 'Änderungen speichern' : 'Veranstaltung speichern') }}
                </button>
                <button
                  v-if="editingEventId"
                  type="button"
                  class="btn btn--ghost"
                  @click="resetEventForm"
                >Abbrechen</button>
              </div>
            </form>
          </section>

          <section v-if="adminEvents.length" class="admin-section">
            <div class="admin-section__head">
              <h2 class="admin-section__title">Veranstaltungen ({{ adminEvents.length }})</h2>
              <span class="admin-section__count">{{ upcomingEventCount }} bevorstehend</span>
            </div>
            <div class="item-list">
              <div
                v-for="e in sortedEvents"
                :key="e.id"
                class="item-list__item"
                :class="{ 'item-list__item--editing': editingEventId === e.id, 'item-list__item--past': isPast(e.date) }"
              >
                <div class="item-list__meta">
                  <span class="tag">{{ e.tag }}</span>
                  <time>{{ formatDate(e.date) }}</time>
                  <span v-if="e.time" class="item-list__inline">· {{ e.time }}</span>
                  <span v-if="isPast(e.date)" class="badge badge--past">vergangen</span>
                </div>
                <div class="item-list__body">
                  <strong class="item-list__title">{{ e.title }}</strong>
                  <p class="item-list__desc">{{ e.description }}</p>
                  <p v-if="e.location" class="item-list__sub">📍 {{ e.location }}</p>
                </div>
                <div class="item-list__actions">
                  <button class="btn btn--ghost btn--sm" @click="editEvent(e)">Bearbeiten</button>
                  <button class="btn btn--danger btn--sm" @click="removeEvent(e)">Löschen</button>
                </div>
              </div>
            </div>
          </section>

          <section v-else class="admin-section admin-section--empty">
            <p>Noch keine Veranstaltungen gespeichert. Hinweis: Bei leerem Stand werden auf der Startseite Beispieltermine angezeigt.</p>
          </section>
        </template>

      </div>
    </main>
  </div>
</template>

<style scoped>
/* ── Shared ── */
.container {
  max-width: 1080px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* ── Login page ── */
.auth-page {
  min-height: 100vh;
  background: var(--bg);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-card {
  background: var(--white);
  border: 1px solid var(--border);
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 400px;
}

.auth-logo {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--clay);
  letter-spacing: 0.05em;
  margin-bottom: 1.5rem;
}

.auth-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 0.25rem;
}

.auth-subtitle {
  color: var(--muted);
  font-size: 0.9rem;
  margin-bottom: 2rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.auth-error {
  font-size: 0.85rem;
  color: #b91c1c;
  margin: -0.5rem 0 0;
}

/* ── Admin layout ── */
.admin-page {
  min-height: 100vh;
  background: var(--bg);
}

.admin-header {
  background: var(--dark);
  color: var(--white);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-header__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
}

.admin-header__brand {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--clay-light, #E8834A);
  letter-spacing: 0.05em;
}

/* ── Tabs ── */
.admin-tabs {
  display: flex;
  gap: 0.25rem;
  flex: 1;
  justify-content: center;
}

.admin-tabs__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.6rem 1.1rem;
  background: transparent;
  color: rgba(255,255,255,0.5);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background-color var(--transition), color var(--transition), border-color var(--transition);
}

.admin-tabs__btn:hover {
  color: var(--white);
}

.admin-tabs__btn--active {
  background: rgba(255,255,255,0.06);
  color: var(--white);
  border-color: rgba(255,255,255,0.12);
}

.admin-tabs__badge {
  font-size: 0.68rem;
  letter-spacing: 0.05em;
  background: rgba(255,255,255,0.1);
  padding: 0.15rem 0.45rem;
  border-radius: 999px;
  min-width: 1.2rem;
  text-align: center;
}

.admin-main {
  padding: 3rem 0 6rem;
}

.admin-section {
  background: var(--white);
  border: 1px solid var(--border);
  padding: 2.5rem;
  margin-bottom: 2rem;
}

.admin-section--empty {
  color: var(--muted);
  font-size: 0.9rem;
}

.admin-section__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1.25rem;
}

.admin-section__title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--black);
  margin: 0;
}

.admin-section__hint {
  font-size: 0.82rem;
  color: var(--muted);
  margin: -0.5rem 0 1.5rem;
}

.admin-section__count {
  font-size: 0.78rem;
  color: var(--muted);
}

.search-input {
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--black);
  font-family: var(--font-sans);
  font-size: 0.88rem;
  padding: 0.45rem 0.75rem;
  outline: none;
  width: 220px;
  max-width: 100%;
}

.search-input:focus { border-color: var(--clay); }

/* ── Form ── */
.post-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 760px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.field__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field__label {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
}

.field__input {
  border: 1px solid var(--border);
  background: var(--white);
  color: var(--black);
  font-family: var(--font-sans);
  font-size: 0.95rem;
  padding: 0.6rem 0.85rem;
  outline: none;
  transition: border-color var(--transition);
  width: 100%;
  box-sizing: border-box;
}

.field__input:focus { border-color: var(--clay); }

.field__input--mono {
  font-family: 'Courier New', monospace;
  font-size: 0.88rem;
}

.field__input--ta { resize: vertical; }

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-field {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: var(--black);
  cursor: pointer;
}

.checkbox-field__input {
  width: 1rem;
  height: 1rem;
  accent-color: var(--clay);
}

.form-actions {
  margin-top: 0.5rem;
  display: flex;
  gap: 0.75rem;
}

/* ── Alerts ── */
.alert {
  padding: 0.85rem 1.25rem;
  font-size: 0.88rem;
  margin-bottom: 1.5rem;
  border-left: 3px solid;
}

.alert--success {
  background: #f0fdf4;
  border-color: #16a34a;
  color: #15803d;
}

.alert--error {
  background: #fef2f2;
  border-color: #dc2626;
  color: #b91c1c;
}

/* ── Item list (shared between posts & events) ── */
.item-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border);
}

.item-list__item {
  background: var(--white);
  padding: 1.25rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 0.5rem 1rem;
  align-items: start;
  transition: background-color var(--transition);
}

.item-list__item--editing {
  background: #fff9f3;
  box-shadow: inset 3px 0 0 var(--clay);
}

.item-list__item--past {
  opacity: 0.55;
}

.item-list__meta {
  grid-column: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.78rem;
  color: var(--muted);
  flex-wrap: wrap;
}

.item-list__inline {
  color: var(--muted);
}

.item-list__body {
  grid-column: 1;
}

.item-list__title {
  font-size: 0.95rem;
  color: var(--black);
  display: block;
  margin-bottom: 0.25rem;
}

.item-list__desc {
  font-size: 0.82rem;
  color: var(--muted);
  margin: 0 0 0.35rem;
}

.item-list__sub {
  font-size: 0.76rem;
  color: var(--muted);
  margin: 0;
}

.item-list__actions {
  grid-column: 2;
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: center;
}

.item-list__empty {
  background: var(--white);
  padding: 2rem 1.5rem;
  text-align: center;
  color: var(--muted);
  font-size: 0.88rem;
}

/* ── Badges ── */
.badge {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.15rem 0.5rem;
  border-radius: 2px;
}

.badge--featured {
  background: var(--clay);
  color: var(--white);
}

.badge--past {
  background: var(--border);
  color: var(--muted);
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  font-family: var(--font-sans);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 0.65rem 1.25rem;
  border: none;
  cursor: pointer;
  text-decoration: none;
  transition: background-color var(--transition), color var(--transition);
  white-space: nowrap;
}

.btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.btn--primary { background: var(--clay); color: var(--white); }
.btn--primary:hover:not(:disabled) { background: var(--dark); }

.btn--ghost {
  background: transparent;
  color: var(--muted);
  border: 1px solid var(--border);
}
.btn--ghost:hover { border-color: var(--clay); color: var(--clay); }

.btn--danger {
  background: transparent;
  color: #b91c1c;
  border: 1px solid #fecaca;
}
.btn--danger:hover { background: #fef2f2; }

.btn--sm { padding: 0.4rem 0.85rem; font-size: 0.72rem; }
.btn--full { width: 100%; }

@media (max-width: 768px) {
  .admin-header__inner { flex-wrap: wrap; }
  .admin-tabs { order: 3; width: 100%; justify-content: flex-start; }
}

@media (max-width: 600px) {
  .field-row { grid-template-columns: 1fr; }
  .admin-section { padding: 1.5rem; }
  .item-list__item {
    grid-template-columns: 1fr;
  }
  .item-list__actions {
    grid-column: 1;
    grid-row: auto;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
