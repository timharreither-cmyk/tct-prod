<script setup>
import { ref, computed, nextTick } from 'vue'
import { marked } from 'marked'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Markdown-Inhalt hier eingeben…' },
  uploader: { type: Function, default: null },
  minHeight: { type: String, default: '380px' },
})

const emit = defineEmits(['update:modelValue', 'upload-error'])

const textarea = ref(null)
const fileInput = ref(null)
const uploading = ref(false)
const mode = ref('split')

const content = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v),
})

const rendered = computed(() => {
  if (!content.value) return '<p class="md-placeholder">Vorschau erscheint hier…</p>'
  return marked.parse(content.value)
    .replace(/<a href=/g, '<a target="_blank" rel="noopener noreferrer" href=')
})

const stats = computed(() => {
  const trimmed = content.value.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  return { words, chars: content.value.length }
})

function replaceSelection(before, after = '', placeholder = 'Text') {
  const el = textarea.value
  if (!el) { mode.value = mode.value === 'preview' ? 'edit' : mode.value; return }
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = content.value.slice(start, end) || placeholder
  const replacement = before + selected + after
  content.value = content.value.slice(0, start) + replacement + content.value.slice(end)
  nextTick(() => {
    el.focus()
    el.setSelectionRange(start + before.length, start + before.length + selected.length)
  })
}

function prefixLine(prefix) {
  const el = textarea.value
  if (!el) return
  const pos = el.selectionStart
  const lineStart = content.value.lastIndexOf('\n', pos - 1) + 1
  content.value = content.value.slice(0, lineStart) + prefix + content.value.slice(lineStart)
  nextTick(() => {
    el.focus()
    const newPos = pos + prefix.length
    el.setSelectionRange(newPos, newPos)
  })
}

function insertAtCursor(text) {
  const el = textarea.value
  const pos = el ? el.selectionStart : content.value.length
  content.value = content.value.slice(0, pos) + text + content.value.slice(pos)
  nextTick(() => {
    if (!el) return
    el.focus()
    el.setSelectionRange(pos + text.length, pos + text.length)
  })
}

function promptLink() {
  const el = textarea.value
  if (!el) return
  const start = el.selectionStart
  const end = el.selectionEnd
  const selected = content.value.slice(start, end)
  const url = window.prompt('URL eingeben:', 'https://')
  if (url === null) return
  const text = selected || 'Linktext'
  const md = `[${text}](${url})`
  content.value = content.value.slice(0, start) + md + content.value.slice(end)
  nextTick(() => {
    el.focus()
    el.setSelectionRange(start + md.length, start + md.length)
  })
}

function triggerUpload() { fileInput.value?.click() }

async function processFile(file) {
  if (!file || !props.uploader) return
  uploading.value = true
  try {
    const url = await props.uploader(file)
    const name = file.name.replace(/\.[^.]+$/, '')
    const isImage = file.type.startsWith('image/')
    const md = isImage ? `![${name}](${url})\n` : `[${name}](${url})`
    insertAtCursor(md)
  } catch (err) {
    emit('upload-error', err)
  } finally {
    uploading.value = false
  }
}

async function onFileInput(e) {
  await processFile(e.target.files?.[0])
  e.target.value = ''
}

function onKeydown(e) {
  if (e.key === 'Tab' && !e.shiftKey) {
    e.preventDefault()
    insertAtCursor('  ')
    return
  }
  const cmd = e.metaKey || e.ctrlKey
  if (!cmd) return
  const key = e.key.toLowerCase()
  if (key === 'b') { e.preventDefault(); replaceSelection('**', '**', 'Fett') }
  else if (key === 'i') { e.preventDefault(); replaceSelection('*', '*', 'Kursiv') }
  else if (key === 'k') { e.preventDefault(); promptLink() }
}

function onDrop(e) {
  e.preventDefault()
  const file = e.dataTransfer?.files?.[0]
  if (file) processFile(file)
}

function onDragOver(e) { e.preventDefault() }

function onPaste(e) {
  const item = Array.from(e.clipboardData?.items || []).find(i => i.type.startsWith('image/'))
  if (!item) return
  e.preventDefault()
  const file = item.getAsFile()
  if (file) processFile(file)
}
</script>

<template>
  <div class="md-editor" :class="[`md-editor--${mode}`, { 'md-editor--uploading': uploading }]">
    <!-- Toolbar -->
    <div class="md-editor__toolbar">
      <div class="md-editor__group">
        <button type="button" class="md-btn" title="Fett (⌘B)" @mousedown.prevent @click="replaceSelection('**', '**', 'Fett')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/>
          </svg>
        </button>
        <button type="button" class="md-btn" title="Kursiv (⌘I)" @mousedown.prevent @click="replaceSelection('*', '*', 'Kursiv')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/>
          </svg>
        </button>
        <button type="button" class="md-btn" title="Inline-Code" @mousedown.prevent @click="replaceSelection('`', '`', 'code')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </button>
      </div>

      <span class="md-editor__sep"></span>

      <div class="md-editor__group">
        <button type="button" class="md-btn md-btn--text" title="Überschrift 2" @mousedown.prevent @click="prefixLine('## ')">H2</button>
        <button type="button" class="md-btn md-btn--text" title="Überschrift 3" @mousedown.prevent @click="prefixLine('### ')">H3</button>
      </div>

      <span class="md-editor__sep"></span>

      <div class="md-editor__group">
        <button type="button" class="md-btn" title="Aufzählung" @mousedown.prevent @click="prefixLine('- ')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/>
          </svg>
        </button>
        <button type="button" class="md-btn" title="Nummerierte Liste" @mousedown.prevent @click="prefixLine('1. ')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
            <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
          </svg>
        </button>
        <button type="button" class="md-btn" title="Zitat" @mousedown.prevent @click="prefixLine('> ')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2H4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 0-1 1v1c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.76-2-2-2h-4c-1.25 0-2 .75-2 2v6c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 0-1 1v1c0 1 0 1 1 1z"/>
          </svg>
        </button>
      </div>

      <span class="md-editor__sep"></span>

      <div class="md-editor__group">
        <button type="button" class="md-btn" title="Link einfügen (⌘K)" @mousedown.prevent @click="promptLink">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>
        <button
          type="button"
          class="md-btn"
          :class="{ 'md-btn--loading': uploading }"
          :disabled="uploading"
          :title="uploading ? 'Lädt hoch…' : 'Bild oder Datei hochladen'"
          @mousedown.prevent
          @click="triggerUpload"
        >
          <svg v-if="!uploading" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <svg v-else class="md-spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
          </svg>
        </button>
        <button type="button" class="md-btn" title="Trennlinie" @mousedown.prevent @click="insertAtCursor('\n\n---\n\n')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <line x1="4" y1="12" x2="20" y2="12"/>
          </svg>
        </button>
      </div>

      <div class="md-editor__modes" role="tablist" aria-label="Ansicht">
        <button type="button" class="md-mode" :class="{ 'md-mode--active': mode === 'edit' }" title="Nur Editor" @click="mode = 'edit'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </button>
        <button type="button" class="md-mode" :class="{ 'md-mode--active': mode === 'split' }" title="Split-Ansicht" @click="mode = 'split'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="12" y1="3" x2="12" y2="21"/>
          </svg>
        </button>
        <button type="button" class="md-mode" :class="{ 'md-mode--active': mode === 'preview' }" title="Nur Vorschau" @click="mode = 'preview'">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Panes -->
    <div class="md-editor__panes" :style="{ minHeight }">
      <div v-if="mode !== 'preview'" class="md-editor__pane md-editor__pane--edit">
        <textarea
          ref="textarea"
          v-model="content"
          class="md-editor__textarea"
          :placeholder="placeholder"
          spellcheck="true"
          @keydown="onKeydown"
          @drop="onDrop"
          @dragover="onDragOver"
          @paste="onPaste"
        />
      </div>
      <div v-if="mode !== 'edit'" class="md-editor__pane md-editor__pane--preview">
        <div class="md-editor__preview" v-html="rendered" />
      </div>
    </div>

    <!-- Footer -->
    <div class="md-editor__footer">
      <span class="md-editor__stats">{{ stats.words }} Wörter · {{ stats.chars }} Zeichen</span>
      <span class="md-editor__hint">⌘B Fett · ⌘I Kursiv · ⌘K Link · Tab für Einzug · Bild einfügen via Drag oder Paste</span>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
      style="display:none"
      @change="onFileInput"
    />
  </div>
</template>

<style scoped>
.md-editor {
  border: 1px solid var(--border);
  background: var(--white);
  display: flex;
  flex-direction: column;
  transition: border-color var(--transition);
}

.md-editor:focus-within {
  border-color: var(--clay);
}

/* ── Toolbar ── */
.md-editor__toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0.4rem 0.5rem;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  flex-wrap: wrap;
}

.md-editor__group {
  display: flex;
  gap: 2px;
}

.md-editor__sep {
  width: 1px;
  height: 1.2rem;
  background: var(--border);
  margin: 0 0.25rem;
}

.md-btn {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.12s, color 0.12s, border-color 0.12s;
}

.md-btn:hover:not(:disabled) {
  background: var(--white);
  border-color: var(--border);
  color: var(--black);
}

.md-btn:active:not(:disabled) {
  background: var(--border);
}

.md-btn--text {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  width: auto;
  padding: 0 0.55rem;
}

.md-btn:disabled { opacity: 0.5; cursor: wait; }

.md-spinner { animation: md-spin 0.9s linear infinite; }
@keyframes md-spin { to { transform: rotate(360deg); } }

.md-editor__modes {
  display: flex;
  gap: 2px;
  margin-left: auto;
  padding-left: 0.5rem;
  border-left: 1px solid var(--border);
}

.md-mode {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 1px solid transparent;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.12s, color 0.12s;
}

.md-mode:hover { color: var(--black); background: var(--white); }

.md-mode--active,
.md-mode--active:hover {
  background: var(--clay);
  color: var(--white);
  border-color: var(--clay);
}

/* ── Panes ── */
.md-editor__panes {
  display: grid;
  grid-template-columns: 1fr;
}

.md-editor--split .md-editor__panes {
  grid-template-columns: 1fr 1fr;
}

.md-editor__pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.md-editor__pane--preview {
  border-left: 1px solid var(--border);
  background: var(--bg);
  overflow-y: auto;
  max-height: 720px;
}

.md-editor--preview .md-editor__pane--preview {
  border-left: none;
}

.md-editor__textarea {
  width: 100%;
  flex: 1;
  border: none;
  outline: none;
  resize: vertical;
  padding: 1.25rem 1.5rem;
  font-family: 'SFMono-Regular', 'Menlo', 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--black);
  background: var(--white);
  box-sizing: border-box;
  tab-size: 2;
}

.md-editor--uploading .md-editor__textarea {
  background: linear-gradient(var(--white), var(--white)), var(--bg);
}

.md-editor__preview {
  padding: 1.25rem 1.5rem;
  font-size: 0.95rem;
  line-height: 1.75;
  color: var(--black);
}

/* ── Footer ── */
.md-editor__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.45rem 0.85rem;
  background: var(--bg);
  border-top: 1px solid var(--border);
  font-size: 0.72rem;
  color: var(--muted);
  gap: 1rem;
}

.md-editor__stats {
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.md-editor__hint {
  font-family: var(--font-sans);
  text-align: right;
  opacity: 0.85;
}

@media (max-width: 820px) {
  .md-editor--split .md-editor__panes { grid-template-columns: 1fr; }
  .md-editor__pane--preview {
    border-left: none;
    border-top: 1px solid var(--border);
    max-height: 400px;
  }
  .md-editor__modes { margin-left: 0; }
  .md-editor__hint { display: none; }
}

/* ── Preview markdown styles ── */
:deep(.md-placeholder) {
  color: var(--muted);
  font-style: italic;
  margin: 0;
}

:deep(.md-editor__preview h1) {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.5rem 0 0.75rem;
  color: var(--black);
}
:deep(.md-editor__preview h2) {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
  padding-bottom: 0.4rem;
  border-bottom: 1px solid var(--border);
  color: var(--black);
}
:deep(.md-editor__preview h3) {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  font-weight: 600;
  margin: 1.25rem 0 0.35rem;
  color: var(--black);
}
:deep(.md-editor__preview h1:first-child),
:deep(.md-editor__preview h2:first-child),
:deep(.md-editor__preview h3:first-child) { margin-top: 0; }
:deep(.md-editor__preview p)         { margin: 0 0 1rem; color: #333; }
:deep(.md-editor__preview ul),
:deep(.md-editor__preview ol)        { padding-left: 1.5rem; margin: 0 0 1rem; }
:deep(.md-editor__preview li)        { margin-bottom: 0.35rem; color: #333; }
:deep(.md-editor__preview strong)    { font-weight: 600; color: var(--black); }
:deep(.md-editor__preview em)        { font-style: italic; color: var(--blue); }
:deep(.md-editor__preview blockquote) {
  border-left: 3px solid var(--blue);
  padding-left: 1.25rem;
  margin: 1.5rem 0;
  color: var(--muted);
  font-style: italic;
}
:deep(.md-editor__preview code) {
  font-family: 'SFMono-Regular', 'Menlo', 'Courier New', monospace;
  font-size: 0.88em;
  background: var(--white);
  border: 1px solid var(--border);
  padding: 0.1em 0.35em;
  border-radius: 2px;
}
:deep(.md-editor__preview img) {
  max-width: 100%;
  height: auto;
  margin: 1rem 0;
  border: 1px solid var(--border);
}
:deep(.md-editor__preview hr) {
  border: none;
  border-top: 1px solid var(--border);
  margin: 2rem 0;
}
:deep(.md-editor__preview a) {
  color: var(--blue);
  text-decoration: underline;
}
</style>
