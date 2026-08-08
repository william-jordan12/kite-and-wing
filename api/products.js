import pool from './_db.js'
import { requireAuth, readBody } from './_auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const id = String(req.query.id || '').trim()
      const full = String(req.query.full || '') === '1'

      if (id) {
        const result = await pool.query(
          `SELECT id, name, brand, category, type, size, price, price_eur, description, image, images FROM products WHERE id = $1`,
          [id]
        )
        if (!result.rows.length) {
          res.status(404).json({ error: 'Product not found' })
          return
        }
        res.json(normalize(result.rows[0]))
        return
      }

      if (full) {
        const result = await pool.query(
          `SELECT id, name, brand, category, type, size, price, price_eur, description, image, images FROM products ORDER BY category, brand, name`
        )
        res.json(result.rows.map(normalize))
        return
      }

      const result = await pool.query(
        `SELECT id, name, brand, category, type, size, price, price_eur FROM products ORDER BY category, brand, name`
      )
      res.json(result.rows.map(normalize))
      return
    }

    if (req.method === 'POST') {
      await authedPost(req, res)
      return
    }

    if (req.method === 'PUT') {
      await authedPut(req, res)
      return
    }

    if (req.method === 'DELETE') {
      await authedDelete(req, res)
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const clean = (s) => String(s == null ? '' : s).trim()

const authedPost = requireAuth(async (req, res) => {
  const body = await readBody(req)
  const id = clean(body.id)
  const name = clean(body.name)
  const brand = clean(body.brand)
  const category = clean(body.category)
  const type = clean(body.type)
  const size = clean(body.size)
  const price = body.price
  const price_eur = body.price_eur == null || body.price_eur === '' ? null : body.price_eur
  const description = clean(body.description)
  const image = body.image || ''
  const images = body.images || null
  if (!id || !name || !brand || !category || !Number.isFinite(Number(price))) {
    res.status(400).json({ error: 'id, name, brand, category and price are required' })
    return
  }
  const imagesJson = Array.isArray(images) && images.length ? JSON.stringify(images) : null
  const result = await pool.query(
    `INSERT INTO products (id, name, brand, category, type, size, price, price_eur, description, image, images)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name, brand = EXCLUDED.brand, category = EXCLUDED.category,
       type = EXCLUDED.type, size = EXCLUDED.size, price = EXCLUDED.price,
       price_eur = EXCLUDED.price_eur, description = EXCLUDED.description,
       image = EXCLUDED.image, images = EXCLUDED.images
     RETURNING id, name, brand, category, type, size, price, price_eur, description, image, images`,
    [id, name, brand, category, type, size, price, price_eur, description, image, imagesJson]
  )
  res.status(201).json(normalize(result.rows[0]))
})

function normalize(row) {
  let images = null
  if (row.images) {
    try {
      const parsed = JSON.parse(row.images)
      if (Array.isArray(parsed)) images = parsed
    } catch {
      images = [row.images]
    }
  }
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category,
    type: row.type,
    size: row.size,
    price: Number(row.price),
    priceEur: row.price_eur == null ? null : Number(row.price_eur),
    description: row.description,
    image: row.image,
    images,
  }
}

const authedPut = requireAuth(async (req, res) => {
  const id = String(req.query.id || '').trim()
  if (!id) {
    res.status(400).json({ error: 'Missing id query parameter' })
    return
  }
  const body = await readBody(req)
  const name = clean(body.name)
  const brand = clean(body.brand)
  const category = clean(body.category)
  const type = clean(body.type)
  const size = clean(body.size)
  const price = body.price
  const price_eur = body.price_eur == null || body.price_eur === '' ? null : body.price_eur
  const description = clean(body.description)
  const image = body.image || ''
  const images = body.images || null
  if (!name || !brand || !category || !Number.isFinite(Number(price))) {
    res.status(400).json({ error: 'name, brand, category and price are required' })
    return
  }
  const imagesJson = Array.isArray(images) && images.length ? JSON.stringify(images) : null
  const result = await pool.query(
    `UPDATE products
     SET name = $2, brand = $3, category = $4, type = $5, size = $6, price = $7, price_eur = $8,
         description = $9, image = $10, images = $11
     WHERE id = $1
     RETURNING id, name, brand, category, type, size, price, price_eur, description, image, images`,
    [id, name, brand, category, type, size, price, price_eur, description, image, imagesJson]
  )
  if (!result.rows.length) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json(normalize(result.rows[0]))
})

const authedDelete = requireAuth(async (req, res) => {
  const id = String(req.query.id || '').trim()
  if (!id) {
    res.status(400).json({ error: 'Missing id query parameter' })
    return
  }
  await pool.query('DELETE FROM products WHERE id = $1', [id])
  res.json({ ok: true })
})
