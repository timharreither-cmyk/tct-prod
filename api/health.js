export default function handler(req, res) {
  res.json({
    ok: true,
    hasGithubToken: !!process.env.Github_Token,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    node: process.version,
    ts: new Date().toISOString(),
  })
}

