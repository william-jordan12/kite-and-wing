import pool from './_db.js'

export default async function handler(req, res) {
  try {
    const id = String(req.query.id || '').trim()
    const n = Math.max(0, parseInt(req.query.n || '0', 10) || 0)

    if (!id) {
      res.status(400).json({ error: 'Missing id query parameter' })
      return
    }

    const result = await pool.query('SELECT image, images FROM products WHERE id = $1', [id])
    const row = result.rows[0]
    if (!row) {
      res.status(404).json({ error: 'Product not found' })
      return
    }

    let list = []
    if (row.images) {
      try {
        const parsed = JSON.parse(row.images)
        if (Array.isArray(parsed)) list = parsed
      } catch {
        // fall through
      }
    }
    if (!list.length && row.image) list = [row.image]

    const src = list[n]
    if (!src || typeof src !== 'string') {
      res.status(404).json({ error: 'Image not found' })
      return
    }

    const m = src.match(/^data:(image\/[a-z0-9+]+);base64,(.+)$/)
    if (!m) {
      res.status(404).json({ error: 'Image not found' })
      return
    }

    const buf = Buffer.from(m[2], 'base64')
    res.setHeader('Content-Type', m[1])
    res.setHeader('Cache-Control', 'public, max-age=86400')
    res.status(200).send(buf)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
