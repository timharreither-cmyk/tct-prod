export default function handler(req, res) {
  res.json({
    ok: true,
    hasGithubToken: !!process.env.GH_PAT,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    node: process.version,
  })
}
