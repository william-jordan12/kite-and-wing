import { requireAuth, readBody } from './_auth.js'

const FILE = 'public/data/products.json'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST' && req.method !== 'DELETE') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }
    await authed(req, res)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const authed = requireAuth(async (req, res) => {
  const headerToken = req.headers['x-github-token']
  const token = process.env.GITHUB_TOKEN || (typeof headerToken === 'string' && headerToken.trim())
  if (!token) {
    res.status(500).json({ error: 'No GitHub token. Add one in Admin → Settings.' })
    return
  }
  const repo = process.env.GITHUB_REPO || 'william-jordan12/kite-and-wing'
  const branch = process.env.GITHUB_BRANCH || 'main'
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'User-Agent': 'kite-and-wing-catalog',
    'X-GitHub-Api-Version': '2022-11-28',
  }

  const url = `https://api.github.com/repos/${repo}/contents/${FILE}?ref=${branch}`
  const current = await fetch(url, { headers })
  let products = []
  let sha = null
  if (current.status === 404) {
    products = []
  } else if (!current.ok) {
    res.status(502).json({ error: `GitHub read failed (${current.status}): ${(await current.text()).slice(0, 150)}` })
    return
  } else {
    const json = await current.json()
    sha = json.sha
    try {
      const parsed = JSON.parse(Buffer.from(json.content, 'base64').toString('utf8'))
      if (Array.isArray(parsed)) products = parsed
    } catch {
      products = []
    }
  }

  if (req.method === 'POST') {
    const body = await readBody(req)
    const p = body.product
    if (!p || !p.id || !p.name || !p.brand || !p.category || !Number.isFinite(Number(p.price))) {
      res.status(400).json({ error: 'id, name, brand, category and price are required' })
      return
    }
    const entry = {
      id: String(p.id).trim(),
      name: String(p.name).trim(),
      brand: String(p.brand).trim(),
      category: String(p.category).trim(),
      type: String(p.type || '').trim(),
      size: String(p.size || '').trim(),
      price: Number(p.price),
      description: String(p.description || '').trim(),
    }
    if (p.priceEur != null && p.priceEur !== '') entry.priceEur = Number(p.priceEur)
    if (typeof p.image === 'string' && p.image) entry.image = p.image
    if (Array.isArray(p.images) && p.images.length) entry.images = p.images.filter(Boolean)
    if (Array.isArray(p.variants) && p.variants.length) entry.variants = p.variants

    const idx = products.findIndex((x) => x.id === entry.id)
    if (idx >= 0) products[idx] = { ...products[idx], ...entry }
    else products.push(entry)
  } else {
    const id = String(req.query.id || '').trim()
    if (!id) {
      res.status(400).json({ error: 'Missing id query parameter' })
      return
    }
    products = products.filter((x) => x.id !== id)
  }

  const content = Buffer.from(JSON.stringify(products, null, 2), 'utf8').toString('base64')
  const put = await fetch(`https://api.github.com/repos/${repo}/contents/${FILE}`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: `Catalog: ${req.method === 'POST' ? 'upsert' : 'delete'} product`,
      content,
      branch,
      ...(sha ? { sha } : {}),
    }),
  })
  if (!put.ok) {
    res.status(502).json({ error: `GitHub write failed (${put.status}): ${(await put.text()).slice(0, 150)}` })
    return
  }
  res.json({ ok: true, count: products.length, live_in_minutes: 2 })
})
