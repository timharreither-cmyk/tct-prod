import { readJsonFile, writeJsonFile } from './_github.js'

const FILE = 'data/admin-events.json'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { data } = await readJsonFile(FILE)
      return res.json(data)
    }
    if (req.method === 'POST') {
      const { data, sha } = await readJsonFile(FILE)
      const event = { ...req.body, id: `event-${Date.now()}` }
      await writeJsonFile(FILE, [event, ...data], sha, `Add event: ${event.title || event.id}`)
      return res.json(event)
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[events]', err)
    res.status(500).json({ error: err.message })
  }
}
