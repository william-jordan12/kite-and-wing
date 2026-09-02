import crypto from 'node:crypto'
import pool from './_db.js'
import { requireAuth } from './_auth.js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }
    await authed(req, res)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME
const KEY = process.env.CLOUDINARY_API_KEY
const SECRET = process.env.CLOUDINARY_API_SECRET

async function uploadToCloudinary(dataUrl, publicId) {
  const timestamp = Math.floor(Date.now() / 1000)
  const params = { overwrite: 'true', public_id: publicId, timestamp: String(timestamp) }
  const toSign = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  const signature = crypto.createHash('sha1').update(toSign + SECRET).digest('hex')
  const body = new URLSearchParams({ file: dataUrl, api_key: KEY, ...params, signature })
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: 'POST', body, signal: AbortSignal.timeout(60000) })
  if (!r.ok) throw new Error(`Cloudinary ${r.status}: ${(await r.text()).slice(0, 120)}`)
  const data = await r.json()
  return data.secure_url
}

const slugify = (s) =>
  String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'photo'

const authed = requireAuth(async (req, res) => {
  if (!CLOUD || !KEY || !SECRET) {
    res.status(500).json({ error: 'Cloudinary not configured' })
    return
  }
  const limit = Math.min(parseInt(String(req.query.limit || '5'), 10) || 5, 20)

  // find products still having base64 cover images
  const { rows } = await pool.query(
    "SELECT id FROM products WHERE image LIKE 'data:%' ORDER BY id LIMIT $1",
    [limit]
  )

  const done = []
  const failed = []
  for (const { id } of rows) {
    try {
      const p = await pool.query('SELECT image, images FROM products WHERE id=$1', [id])
      if (!p.rows.length) { done.push(id); continue }
      const row = p.rows[0]
      let gallery = []
      if (row.images) {
        try { const g = JSON.parse(row.images); gallery = Array.isArray(g) ? g : [] } catch {}
      }
      const entries = []
      if (row.image) entries.push(row.image)
      for (const g of gallery) entries.push(g)
      const seen = new Set()
      const uniq = entries.filter(e => { if (!e || seen.has(e)) return false; seen.add(e); return true })
      if (!uniq.length) { done.push(id); continue }

      const base = `kw/${slugify(id)}`
      const urls = []
      let idx = 0
      for (const entry of uniq) {
        if (!entry.startsWith('data:')) { urls.push(entry); continue }
        urls.push(await uploadToCloudinary(entry, `${base}-${String(idx).padStart(2, '0')}`))
        idx++
      }
      const newImage = urls[0]
      const finalGallery = urls.slice(1)
      const imagesJson = finalGallery.length ? JSON.stringify(finalGallery) : null
      await pool.query('UPDATE products SET image=$2, images=$3 WHERE id=$1', [id, newImage, imagesJson])
      done.push(id)
    } catch (e) {
      failed.push({ id, error: e.message })
    }
  }

  const remaining = await pool.query("SELECT COUNT(*) AS n FROM products WHERE image LIKE 'data:%'")
  res.json({
    processed: done.length,
    failed,
    remainingBase64: Number(remaining.rows[0].n),
    done,
  })
})
