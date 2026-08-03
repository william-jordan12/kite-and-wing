import pool from '../_db.js'
import { requireAuth, readBody } from '../_auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'DELETE') {
      await authedDelete(req, res)
      return
    }
    if (req.method === 'PUT') {
      await authedPut(req, res)
      return
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

function getId(req) {
  return decodeURIComponent(req.url.split('/').filter(Boolean).pop() || '')
}

const authedPut = requireAuth(async (req, res) => {
  const id = getId(req)
  const body = await readBody(req)
  const { name, brand, category, type = '', size = '', price, description = '', image = '' } = body
  if (!name || !brand || !category || !Number.isFinite(Number(price))) {
    res.status(400).json({ error: 'name, brand, category and price are required' })
    return
  }
  const result = await pool.query(
    `UPDATE products
     SET name = $2, brand = $3, category = $4, type = $5, size = $6, price = $7, description = $8, image = $9
     WHERE id = $1
     RETURNING id, name, brand, category, type, size, price, description, image`,
    [id, name, brand, category, type, size, price, description, image]
  )
  if (!result.rows.length) {
    res.status(404).json({ error: 'Product not found' })
    return
  }
  res.json({ ...result.rows[0], price: Number(result.rows[0].price) })
})

const authedDelete = requireAuth(async (req, res) => {
  const id = getId(req)
  await pool.query('DELETE FROM products WHERE id = $1', [id])
  res.json({ ok: true })
})
