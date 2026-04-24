import express from 'express'
import { readFileSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname, extname } from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'data', 'admin-posts.json')
const UPLOADS_DIR = join(__dirname, 'public', 'uploads')

mkdirSync(join(__dirname, 'data'), { recursive: true })
mkdirSync(UPLOADS_DIR, { recursive: true })

const app = express()
app.use(express.json({ limit: '10mb' }))

function readPosts() {
  try { return JSON.parse(readFileSync(DATA_FILE, 'utf8')) } catch { return [] }
}

function writePosts(posts) {
  writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2))
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

app.get('/api/posts', (_req, res) => res.json(readPosts()))

app.post('/api/posts', (req, res) => {
  const posts = readPosts()
  const post = { ...req.body, id: `admin-${Date.now()}` }
  writePosts([post, ...posts])
  res.json(post)
})

app.delete('/api/posts/:id', (req, res) => {
  writePosts(readPosts().filter(p => p.id !== req.params.id))
  res.json({ ok: true })
})

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
