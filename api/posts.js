import { readJsonFile, writeJsonFile } from './_github.js'

const FILE = 'data/admin-posts.json'

export default async function handler(req, res) {
  try {
    const id = req.query.id

    if (req.method === 'GET' && !id) {
      const { data } = await readJsonFile(FILE)
      return res.json(data)
    }
    if (req.method === 'POST' && !id) {
      const { data, sha } = await readJsonFile(FILE)
      const post = { ...req.body, id: `admin-${Date.now()}` }
      await writeJsonFile(FILE, [post, ...data], sha, `Add post: ${post.title || post.id}`)
      return res.json(post)
    }
    if (req.method === 'PUT' && id) {
      const { data, sha } = await readJsonFile(FILE)
      const idx = data.findIndex(p => p.id === id)
      if (idx === -1) return res.status(404).json({ error: 'Not found' })
      const updated = { ...data[idx], ...req.body, id }
      data[idx] = updated
      await writeJsonFile(FILE, data, sha, `Update post: ${updated.title || id}`)
      return res.json(updated)
    }
    if (req.method === 'DELETE' && id) {
      const { data, sha } = await readJsonFile(FILE)
      const filtered = data.filter(p => p.id !== id)
      await writeJsonFile(FILE, filtered, sha, `Delete post: ${id}`)
      return res.json({ ok: true })
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[posts]', err)
    res.status(500).json({ error: err.message })
  }
}
