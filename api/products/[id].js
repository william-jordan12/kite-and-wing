import pool from '../_db.js'
import { requireAuth, readBody } from '../_auth.js'

export const PUT = requireAuth(async (req, res) => {
  const id = decodeURIComponent(req.url.split('/').filter(Boolean).pop() || '')
  const body = await readBody(req)
  const { name, brand, category, type = '', size = '', price, description = '' } = body
  if (!name || !brand || !category || !Number.isFinite(Number(price))) {
    res.status(400).json({ error: 'name, brand, category and price are required' })
    return
  }
  const result = await pool.query(
    `UPDATE products
     SET name = $2, brand = $3, category = $4, type = $5, size = $6, price = $7, description = $8
     WHERE id = $1
     RETURNING id, name, brand, category, type, size, price, description`,
    [id, name, brand, category, type, size, price, description]
  )
  if (!result.rows.length) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json({ ...result.rows[0], price: Number(result.rows[0].price) })
})

export const DELETE = requireAuth(async (req, res) => {
  const id = decodeURIComponent(req.url.split('/').filter(Boolean).pop() || '')
  await pool.query('DELETE FROM products WHERE id = $1', [id])
  res.json({ ok: true })
})
