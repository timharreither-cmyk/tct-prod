import { readJsonFile, writeJsonFile } from './_github.js'

const FILE = 'data/admin-events.json'

export default async function handler(req, res) {
  try {
    const id = req.query.id

    if (req.method === 'GET' && !id) {
      const { data } = await readJsonFile(FILE)
      return res.json(data)
    }
    if (req.method === 'POST' && !id) {
      const { data, sha } = await readJsonFile(FILE)
      const event = { ...req.body, id: `event-${Date.now()}` }
      await writeJsonFile(FILE, [event, ...data], sha, `Add event: ${event.title || event.id}`)
      return res.json(event)
    }
    if (req.method === 'PUT' && id) {
      const { data, sha } = await readJsonFile(FILE)
      const idx = data.findIndex(e => e.id === id)
      if (idx === -1) return res.status(404).json({ error: 'Not found' })
      const updated = { ...data[idx], ...req.body, id }
      data[idx] = updated
      await writeJsonFile(FILE, data, sha, `Update event: ${updated.title || id}`)
      return res.json(updated)
    }
    if (req.method === 'DELETE' && id) {
      const { data, sha } = await readJsonFile(FILE)
      const filtered = data.filter(e => e.id !== id)
      await writeJsonFile(FILE, filtered, sha, `Delete event: ${id}`)
      return res.json({ ok: true })
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[events]', err)
    res.status(500).json({ error: err.message })
  }
}
