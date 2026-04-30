const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const REPO_OWNER = 'timharreither-cmyk'
const REPO_NAME = 'tct'
const BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents`

function ghHeaders() {
  return {
    Authorization: `Bearer ${GITHUB_TOKEN}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  }
}

export async function readJsonFile(path) {
  const res = await fetch(`${BASE}/${path}`, { headers: ghHeaders() })
  if (res.status === 404) return { data: [], sha: null }
  if (!res.ok) throw new Error(`GitHub read error: ${res.status}`)
  const json = await res.json()
  // GitHub base64 content may contain newlines – strip them before decoding
  const content = Buffer.from(json.content.replace(/\s/g, ''), 'base64').toString('utf8')
  return { data: JSON.parse(content), sha: json.sha }
}

export async function writeJsonFile(path, data, sha, message) {
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64')
  const body = { message, content }
  if (sha) body.sha = sha
  const res = await fetch(`${BASE}/${path}`, {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub write error: ${res.status} – ${text}`)
  }
}
