import { readJsonFile, writeJsonFile } from '../_github.js'

const FILE = 'data/admin-posts.json'

export default async function handler(req, res) {
  const { id } = req.query
  try {
    if (req.method === 'PUT') {
      const { data, sha } = await readJsonFile(FILE)
      const idx = data.findIndex(p => p.id === id)
      if (idx === -1) return res.status(404).json({ error: 'Not found' })
      const updated = { ...data[idx], ...req.body, id: data[idx].id }
      data[idx] = updated
      await writeJsonFile(FILE, data, sha, `Update post: ${updated.title || id}`)
      return res.json(updated)
    }
    if (req.method === 'DELETE') {
      const { data, sha } = await readJsonFile(FILE)
      await writeJsonFile(FILE, data.filter(p => p.id !== id), sha, `Delete post: ${id}`)
      return res.json({ ok: true })
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[posts/id]', err)
    res.status(500).json({ error: err.message })
  }
}
