import pool from './_db.js'
import { requireAuth, readBody } from './_auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await pool.query(
        `SELECT id, name, brand, category, type, size, price, description FROM products ORDER BY category, brand, name`
      )
      res.json(result.rows.map(normalize))
      return
    }

    if (req.method === 'POST') {
      await authedPost(req, res)
      return
    }

    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const authedPost = requireAuth(async (req, res) => {
  const body = await readBody(req)
  const { id, name, brand, category, type = '', size = '', price, description = '' } = body
  if (!id || !name || !brand || !category || !Number.isFinite(Number(price))) {
    res.status(400).json({ error: 'id, name, brand, category and price are required' })
    return
  }
  const result = await pool.query(
    `INSERT INTO products (id, name, brand, category, type, size, price, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name, brand = EXCLUDED.brand, category = EXCLUDED.category,
       type = EXCLUDED.type, size = EXCLUDED.size, price = EXCLUDED.price,
       description = EXCLUDED.description
     RETURNING id, name, brand, category, type, size, price, description`,
    [id, name, brand, category, type, size, price, description]
  )
  res.status(201).json(normalize(result.rows[0]))
})

function normalize(row) {
  return {
    ...row,
    price: Number(row.price),
  }
}
