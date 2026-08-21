import { requireAuth, readBody } from './_auth.js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }
    await authed(req, res)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const EXT = { png: 'png', jpeg: 'jpg', jpg: 'jpg', webp: 'webp', gif: 'gif' }

const authed = requireAuth(async (req, res) => {
  const body = await readBody(req)
  const m = String(body.dataUrl || '').match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/s)
  if (!m) {
    res.status(400).json({ error: 'Invalid image data' })
    return
  }
  const headerToken = req.headers['x-github-token']
  const token = process.env.GITHUB_TOKEN || (typeof headerToken === 'string' && headerToken.trim())
  if (!token) {
    res.status(500).json({ error: 'No GitHub token. Add one in Admin → Settings.' })
    return
  }
  const ext = EXT[m[1]]
  const slug =
    String(body.slug || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'photo'
  const name = `${slug}-${Date.now()}.${ext}`
  const repo = process.env.GITHUB_REPO || 'william-jordan12/kite-and-wing'
  const branch = process.env.GITHUB_BRANCH || 'main'
  const path = `public/images/products/${name}`

  const r = await fetch(`https://api.github.com/repos/${repo}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'kite-and-wing-upload',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({
      message: `Add product photo ${name}`,
      content: m[2],
      branch,
    }),
  })
  if (!r.ok) {
    const text = await r.text()
    res.status(502).json({ error: `GitHub upload failed (${r.status}): ${text.slice(0, 200)}` })
    return
  }
  res.status(201).json({ url: `/images/products/${name}` })
})
