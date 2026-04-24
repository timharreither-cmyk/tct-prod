<script setup>
import { ref, computed, nextTick } from 'vue'
import { marked } from 'marked'
import { adminPosts, savePost, deletePost, uploadFile } from '../data/posts.js'

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

// ── Post form ─────────────────────────────────────────────────────────────────
const CATEGORIES = ['Events', 'Clublokal', 'Anlage', 'Jugend', 'Allgemein']

const form = ref(emptyForm())
const successMsg = ref('')
const errorMsg = ref('')
const saving = ref(false)
const previewMode = ref(false)
const contentRef = ref(null)
const fileInput = ref(null)
const uploading = ref(false)

function emptyForm() {
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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function onTitleInput(e) {
  if (!form.value._slugEdited) {
    form.value.slug = slugify(e.target.value)
  }
}

function onSlugInput() {
  form.value._slugEdited = true
}

const renderedContent = computed(() => {
  if (!form.value.content) return '<p style="color:var(--muted)">Vorschau erscheint hier…</p>'
  return marked.parse(form.value.content)
    .replace(/<a href=/g, '<a target="_blank" rel="noopener noreferrer" href=')
})

async function submitPost() {
  const { title, slug, category, date, excerpt, content } = form.value
  if (!title || !slug || !excerpt || !content) return

  saving.value = true
  errorMsg.value = ''
  try {
    await savePost({ slug, title, date, category, excerpt, content, image: null, featured: form.value.featured })
    form.value = emptyForm()
    successMsg.value = 'Beitrag wurde auf dem Server gespeichert!'
    setTimeout(() => { successMsg.value = '' }, 5000)
  } catch {
    errorMsg.value = 'Fehler beim Speichern. Ist der Server erreichbar?'
  } finally {
    saving.value = false
  }
}

async function removePost(id) {
  try {
    await deletePost(id)
  } catch {
    errorMsg.value = 'Löschen fehlgeschlagen.'
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('de-AT', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

// ── Markdown toolbar ──────────────────────────────────────────────────────────
function insertMarkdown(before, after = '', placeholder = 'Text') {
  const el = contentRef.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = form.value.content.slice(start, end) || placeholder
  const replacement = before + selected + after
  form.value.content = form.value.content.slice(0, start) + replacement + form.value.content.slice(end)
  nextTick(() => {
    el.focus()
    el.setSelectionRange(start + before.length, start + before.length + selected.length)
  })
}

function insertLinePrefix(prefix) {
  const el = contentRef.value
  if (!el) return
  const pos = el.selectionStart
  const lineStart = form.value.content.lastIndexOf('\n', pos - 1) + 1
  form.value.content = form.value.content.slice(0, lineStart) + prefix + form.value.content.slice(lineStart)
  nextTick(() => {
    el.focus()
    const newPos = pos + prefix.length
    el.setSelectionRange(newPos, newPos)
  })
}

function insertAtCursor(text) {
  const el = contentRef.value
  const pos = el ? el.selectionStart : form.value.content.length
  form.value.content = form.value.content.slice(0, pos) + text + form.value.content.slice(pos)
  nextTick(() => {
    if (!el) return
    el.focus()
    el.setSelectionRange(pos + text.length, pos + text.length)
  })
}

function insertLink() {
  const el = contentRef.value
  if (!el) return
  // Save selection before prompt steals focus
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = form.value.content.slice(start, end)

  const url = window.prompt('URL eingeben:', 'https://')
  if (url === null) return  // user cancelled

  const text = selected || 'Linktext'
  const md = `[${text}](${url})`
  form.value.content = form.value.content.slice(0, start) + md + form.value.content.slice(end)
  nextTick(() => {
    el.focus()
    el.setSelectionRange(start + md.length, start + md.length)
  })
}

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileUpload(e) {
  const file = e.target.files?.[0]
  if (!file) return
  uploading.value = true
  try {
    const url = await uploadFile(file)
    const name = file.name.replace(/\.[^.]+$/, '')
    const isImage = file.type.startsWith('image/')
    const md = isImage ? `![${name}](${url})` : `[${name}](${url})`
    insertAtCursor(md)
  } catch {
    errorMsg.value = 'Datei-Upload fehlgeschlagen.'
    setTimeout(() => { errorMsg.value = '' }, 4000)
  } finally {
    uploading.value = false
    e.target.value = ''
  }
}

const toolbarButtons = [
  { label: 'B',   title: 'Fett',          action: () => insertMarkdown('**', '**', 'Fett') },
  { label: 'I',   title: 'Kursiv',        action: () => insertMarkdown('*', '*', 'Kursiv') },
  { label: 'H2',  title: 'Überschrift 2', action: () => insertLinePrefix('## ') },
  { label: 'H3',  title: 'Überschrift 3', action: () => insertLinePrefix('### ') },
  { label: '–',   title: 'Aufzählung',    action: () => insertLinePrefix('- ') },
  { label: '1.',  title: 'Nummeriert',    action: () => insertLinePrefix('1. ') },
  { label: '❝',   title: 'Zitat',         action: () => insertLinePrefix('> ') },
  { label: '`',   title: 'Code',          action: () => insertMarkdown('`', '`', 'code') },
  { label: '—',   title: 'Trennlinie',    action: () => insertAtCursor('\n\n---\n\n') },
]
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
          <input
            id="user"
            v-model="loginUser"
            type="text"
            class="field__input"
            autocomplete="username"
            required
          />
        </div>
        <div class="field">
          <label class="field__label" for="pass">Passwort</label>
          <input
            id="pass"
            v-model="loginPass"
            type="password"
            class="field__input"
            autocomplete="current-password"
            required
          />
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
          <button class="btn btn--ghost btn--sm" @click="logout">Abmelden</button>
        </div>
      </div>
    </header>

    <main class="admin-main">
      <div class="container">

        <!-- Global messages -->
        <div v-if="successMsg" class="alert alert--success">{{ successMsg }}</div>
        <div v-if="errorMsg"   class="alert alert--error">{{ errorMsg }}</div>

        <!-- New post form -->
        <section class="admin-section">
          <h2 class="admin-section__title">Neuen Beitrag erstellen</h2>

          <div class="post-editor">
            <form class="post-form" @submit.prevent="submitPost">

              <div class="field">
                <label class="field__label" for="f-title">Titel *</label>
                <input
                  id="f-title"
                  v-model="form.title"
                  type="text"
                  class="field__input"
                  @input="onTitleInput"
                  required
                />
              </div>

              <div class="field-row">
                <div class="field">
                  <label class="field__label" for="f-slug">Slug *</label>
                  <input
                    id="f-slug"
                    v-model="form.slug"
                    type="text"
                    class="field__input field__input--mono"
                    @input="onSlugInput"
                    required
                  />
                </div>
                <div class="field">
                  <label class="field__label" for="f-date">Datum *</label>
                  <input id="f-date" v-model="form.date" type="date" class="field__input" required />
                </div>
              </div>

              <div class="field">
                <label class="field__label" for="f-cat">Kategorie</label>
                <select id="f-cat" v-model="form.category" class="field__input">
                  <option v-for="c in CATEGORIES" :key="c" :value="c">{{ c }}</option>
                </select>
              </div>

              <div class="field">
                <label class="field__label" for="f-excerpt">Teaser *</label>
                <textarea
                  id="f-excerpt"
                  v-model="form.excerpt"
                  class="field__input field__input--ta"
                  rows="3"
                  required
                />
              </div>

              <!-- Markdown editor -->
              <div class="field">
                <div class="field__header">
                  <label class="field__label" for="f-content">Inhalt (Markdown) *</label>
                  <button type="button" class="btn btn--ghost btn--sm" @click="previewMode = !previewMode">
                    {{ previewMode ? 'Bearbeiten' : 'Vorschau' }}
                  </button>
                </div>

                <!-- Toolbar (only in edit mode) -->
                <div v-if="!previewMode" class="md-toolbar">
                  <button
                    v-for="btn in toolbarButtons"
                    :key="btn.label"
                    type="button"
                    class="md-toolbar__btn"
                    :title="btn.title"
                    @mousedown.prevent
                    @click="btn.action()"
                  >{{ btn.label }}</button>

                  <span class="md-toolbar__sep"></span>

                  <button type="button" class="md-toolbar__btn" title="Link einfügen" @mousedown.prevent @click="insertLink">
                    🔗
                  </button>
                  <button
                    type="button"
                    class="md-toolbar__btn md-toolbar__btn--upload"
                    :class="{ 'md-toolbar__btn--loading': uploading }"
                    title="Bild oder Datei hochladen"
                    :disabled="uploading"
                    @mousedown.prevent
                    @click="triggerUpload"
                  >
                    {{ uploading ? '…' : '📎' }}
                  </button>

                  <!-- Hidden file input -->
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
                    style="display:none"
                    @change="handleFileUpload"
                  />
                </div>

                <textarea
                  v-if="!previewMode"
                  id="f-content"
                  ref="contentRef"
                  v-model="form.content"
                  class="field__input field__input--ta field__input--mono field__input--content"
                  rows="16"
                  placeholder="Markdown-Inhalt hier eingeben…&#10;&#10;## Überschrift&#10;**Fett**, *Kursiv*, ![Bild](url)"
                  required
                />
                <div v-else class="content-preview post-body" v-html="renderedContent" />
              </div>

              <label class="checkbox-field">
                <input v-model="form.featured" type="checkbox" class="checkbox-field__input" />
                <span>Als Featured-Beitrag markieren</span>
              </label>

              <div class="form-actions">
                <button type="submit" class="btn btn--primary" :disabled="saving">
                  {{ saving ? 'Wird gespeichert…' : 'Beitrag speichern' }}
                </button>
              </div>
            </form>
          </div>
        </section>

        <!-- Published admin posts -->
        <section v-if="adminPosts.length" class="admin-section">
          <h2 class="admin-section__title">Gespeicherte Beiträge ({{ adminPosts.length }})</h2>
          <p class="admin-section__hint">Diese Beiträge sind auf dem Server gespeichert und für alle Besucher sichtbar.</p>
          <div class="post-list">
            <div v-for="p in adminPosts" :key="p.id" class="post-list__item">
              <div class="post-list__meta">
                <span class="tag">{{ p.category }}</span>
                <time>{{ formatDate(p.date) }}</time>
              </div>
              <div class="post-list__body">
                <strong class="post-list__title">{{ p.title }}</strong>
                <p class="post-list__excerpt">{{ p.excerpt }}</p>
              </div>
              <div class="post-list__actions">
                <RouterLink :to="`/news/${p.slug}`" class="btn btn--ghost btn--sm" target="_blank">Ansehen</RouterLink>
                <button class="btn btn--danger btn--sm" @click="removePost(p.id)">Löschen</button>
              </div>
            </div>
          </div>
        </section>

        <section v-else class="admin-section admin-section--empty">
          <p>Noch keine Beiträge auf dem Server gespeichert.</p>
        </section>

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
}

.admin-header__brand {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--clay-light, #E8834A);
  letter-spacing: 0.05em;
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

.admin-section__title {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--black);
  margin-bottom: 1.75rem;
}

.admin-section__hint {
  font-size: 0.82rem;
  color: var(--muted);
  margin: -1rem 0 1.5rem;
}

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

.field__input:focus {
  border-color: var(--clay);
}

.field__input--mono {
  font-family: 'Courier New', monospace;
  font-size: 0.88rem;
}

.field__input--ta {
  resize: vertical;
}

.field__input--content {
  min-height: 320px;
  border-top: none;
}

.field-row {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 1rem;
}

/* ── Markdown toolbar ── */
.md-toolbar {
  display: flex;
  align-items: center;
  gap: 2px;
  background: var(--bg);
  border: 1px solid var(--border);
  border-bottom: none;
  padding: 0.4rem 0.5rem;
  flex-wrap: wrap;
}

.md-toolbar__btn {
  font-family: 'Courier New', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.3rem 0.55rem;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  border-radius: 2px;
  line-height: 1;
  transition: background-color 0.1s, color 0.1s, border-color 0.1s;
  white-space: nowrap;
}

.md-toolbar__btn:hover {
  background: var(--white);
  border-color: var(--border);
  color: var(--black);
}

.md-toolbar__btn--upload {
  font-size: 0.85rem;
}

.md-toolbar__btn--loading {
  opacity: 0.5;
  cursor: wait;
}

.md-toolbar__sep {
  width: 1px;
  height: 1.2rem;
  background: var(--border);
  margin: 0 0.25rem;
}

/* ── Preview ── */
.content-preview {
  border: 1px solid var(--border);
  padding: 1.25rem 1.5rem;
  min-height: 320px;
  background: var(--bg);
  font-size: 0.95rem;
  line-height: 1.75;
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

/* ── Post list ── */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: var(--border);
}

.post-list__item {
  background: var(--white);
  padding: 1.25rem 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  gap: 0.5rem 1rem;
  align-items: start;
}

.post-list__meta {
  grid-column: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.78rem;
  color: var(--muted);
}

.post-list__body {
  grid-column: 1;
}

.post-list__title {
  font-size: 0.95rem;
  color: var(--black);
  display: block;
  margin-bottom: 0.25rem;
}

.post-list__excerpt {
  font-size: 0.82rem;
  color: var(--muted);
  margin: 0;
}

.post-list__actions {
  grid-column: 2;
  grid-row: 1 / 3;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: center;
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

/* ── Markdown preview styles (reuse from PostView) ── */
:deep(.post-body h2) {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border);
}
:deep(.post-body h3) {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 600;
  margin: 1.25rem 0 0.35rem;
}
:deep(.post-body p)         { margin-bottom: 1rem; }
:deep(.post-body ul),
:deep(.post-body ol)        { padding-left: 1.5rem; margin-bottom: 1rem; }
:deep(.post-body li)        { margin-bottom: 0.35rem; }
:deep(.post-body strong)    { font-weight: 600; }
:deep(.post-body em)        { font-style: italic; color: var(--blue); }
:deep(.post-body blockquote) {
  border-left: 3px solid var(--blue);
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  color: var(--muted);
  font-style: italic;
}
:deep(.post-body code) {
  font-family: 'Courier New', monospace;
  font-size: 0.88em;
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 0.1em 0.35em;
  border-radius: 2px;
}
:deep(.post-body img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border: 1px solid var(--border);
}
:deep(.post-body hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}
:deep(.post-body a) {
  color: var(--blue);
  text-decoration: underline;
}

@media (max-width: 600px) {
  .field-row { grid-template-columns: 1fr; }
  .admin-section { padding: 1.5rem; }
  .md-toolbar { gap: 1px; }
}
</style>
