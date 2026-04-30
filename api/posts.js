import { readJsonFile, writeJsonFile } from './_github.js'

const FILE = 'data/admin-posts.json'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { data } = await readJsonFile(FILE)
      return res.json(data)
    }
    if (req.method === 'POST') {
      const { data, sha } = await readJsonFile(FILE)
      const post = { ...req.body, id: `admin-${Date.now()}` }
      await writeJsonFile(FILE, [post, ...data], sha, `Add post: ${post.title || post.id}`)
      return res.json(post)
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error('[posts]', err)
    res.status(500).json({ error: err.message })
  }
}
