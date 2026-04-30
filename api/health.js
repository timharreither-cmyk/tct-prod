export default function handler(req, res) {
  res.json({
    ok: true,
    hasGithubToken: !!process.env.Github_Token,
    hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
    repo: `${process.env.GITHUB_REPO_OWNER || 'timharreither-cmyk'}/${process.env.GITHUB_REPO_NAME || 'tct'}`,
    node: process.version,
    ts: new Date().toISOString(),
  })
}

