export default function handler(req, res) {
  res.json({
    ok: true,
    hasGithubToken: !!process.env.GITHUB_TOKEN,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    node: process.version,
  })
}
