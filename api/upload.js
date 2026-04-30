import formidable from 'formidable'
import { readFile } from 'fs/promises'
import { extname } from 'path'

const GITHUB_TOKEN = process.env.Github_Token
const REPO_OWNER = process.env.GITHUB_REPO_OWNER || 'timharreither-cmyk'
const REPO_NAME = process.env.GITHUB_REPO_NAME || 'tct'
const BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`

function ghHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const form = formidable({ maxFileSize: 10 * 1024 * 1024 })
    const [, files] = await form.parse(req)
    const file = Array.isArray(files.file) ? files.file[0] : files.file
    if (!file) return res.status(400).json({ error: 'No file uploaded' })

    const ext = extname(file.originalFilename || '.jpg')
    const filename = `${Date.now()}${ext}`
    const repoPath = `uploads/${filename}`

    const buffer = await readFile(file.filepath)
    const content = buffer.toString('base64')

    const ghRes = await fetch(`${BASE}/${repoPath}`, {
      method: 'PUT',
      headers: ghHeaders(),
      body: JSON.stringify({ message: `Upload image: ${filename}`, content }),
    })
    if (!ghRes.ok) {
      const err = await ghRes.text()
      throw new Error(`GitHub upload error: ${ghRes.status} – ${err}`)
    }

    const url = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/main/${repoPath}`
    res.json({ url })
  } catch (err) {
    console.error('[upload]', err)
    res.status(500).json({ error: err.message })
  }
}
