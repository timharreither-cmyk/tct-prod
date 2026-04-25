import express from 'express'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const POSTS_FILE = join(__dirname, 'data', 'admin-posts.json')
const EVENTS_FILE = join(__dirname, 'data', 'admin-events.json')
const UPLOADS_DIR = join(__dirname, 'public', 'uploads')

mkdirSync(join(__dirname, 'data'), { recursive: true })
mkdirSync(UPLOADS_DIR, { recursive: true })

const app = express()
app.use(express.json({ limit: '10mb' }))

function readJson(file) {
  try { return JSON.parse(readFileSync(file, 'utf8')) } catch { return [] }
}

function writeJson(file, data) {
  writeFileSync(file, JSON.stringify(data, null, 2))
}

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (_req, file, cb) => {
    const ext = extname(file.originalname)
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 60)
    cb(null, `${Date.now()}-${safe}`)
  },
})
const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } })

// ── Posts ─────────────────────────────────────────────────────────────────────
app.get('/api/posts', (_req, res) => res.json(readJson(POSTS_FILE)))

app.post('/api/posts', (req, res) => {
  const posts = readJson(POSTS_FILE)
  const post = { ...req.body, id: `admin-${Date.now()}` }
  writeJson(POSTS_FILE, [post, ...posts])
  res.json(post)
})

app.put('/api/posts/:id', (req, res) => {
  const posts = readJson(POSTS_FILE)
  const idx = posts.findIndex(p => p.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const updated = { ...posts[idx], ...req.body, id: posts[idx].id }
  posts[idx] = updated
  writeJson(POSTS_FILE, posts)
  res.json(updated)
})

app.delete('/api/posts/:id', (req, res) => {
  writeJson(POSTS_FILE, readJson(POSTS_FILE).filter(p => p.id !== req.params.id))
  res.json({ ok: true })
})

// ── Events ────────────────────────────────────────────────────────────────────
app.get('/api/events', (_req, res) => res.json(readJson(EVENTS_FILE)))

app.post('/api/events', (req, res) => {
  const events = readJson(EVENTS_FILE)
  const event = { ...req.body, id: `event-${Date.now()}` }
  writeJson(EVENTS_FILE, [event, ...events])
  res.json(event)
})

app.put('/api/events/:id', (req, res) => {
  const events = readJson(EVENTS_FILE)
  const idx = events.findIndex(e => e.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  const updated = { ...events[idx], ...req.body, id: events[idx].id }
  events[idx] = updated
  writeJson(EVENTS_FILE, events)
  res.json(updated)
})

app.delete('/api/events/:id', (req, res) => {
  writeJson(EVENTS_FILE, readJson(EVENTS_FILE).filter(e => e.id !== req.params.id))
  res.json({ ok: true })
})

// ── Uploads ───────────────────────────────────────────────────────────────────
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

app.use('/uploads', express.static(UPLOADS_DIR))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'dist')))
  app.get('*', (_req, res) => res.sendFile(join(__dirname, 'dist', 'index.html')))
}

const PORT = process.env.API_PORT || 3001
app.listen(PORT, () => console.log(`TCT API server → http://localhost:${PORT}`))
