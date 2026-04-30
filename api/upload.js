import { put } from '@vercel/blob'
import formidable from 'formidable'
import { createReadStream } from 'fs'

export const config = { api: { bodyParser: false } }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  try {
    const form = formidable({ maxFileSize: 10 * 1024 * 1024 })
    const [, files] = await form.parse(req)
    const file = Array.isArray(files.file) ? files.file[0] : files.file
    if (!file) return res.status(400).json({ error: 'No file uploaded' })

    const blob = await put(
      `uploads/${Date.now()}-${file.originalFilename || 'file'}`,
      createReadStream(file.filepath),
      { access: 'public', contentType: file.mimetype || 'application/octet-stream' },
    )
    res.json({ url: blob.url })
  } catch (err) {
    console.error('[upload]', err)
    res.status(500).json({ error: err.message })
  }
}
