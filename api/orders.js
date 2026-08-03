import pool from './_db.js'
import { requireAuth, readBody } from './_auth.js'

export const GET = requireAuth(async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, created_at, full_name, email, phone, shipping, billing, payment_method, channel, total, items
       FROM orders ORDER BY created_at DESC LIMIT 200`
    )
    res.json(result.rows.map(normalize))
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export async function POST(req, res) {
  try {
    const body = await readBody(req)
    const {
      fullName,
      email,
      phone = '',
      shipping = '',
      billing = '',
      paymentMethod,
      channel,
      items,
      total,
    } = body
    if (!fullName || !email || !paymentMethod || !items?.length || !Number.isFinite(Number(total))) {
      res.status(400).json({ error: 'fullName, email, paymentMethod, items and total are required' })
      return
    }
    const result = await pool.query(
      `INSERT INTO orders (full_name, email, phone, shipping, billing, payment_method, channel, total, items)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id`,
      [fullName, email, phone, shipping, billing, paymentMethod, channel || 'email', total, JSON.stringify(items)]
    )
    res.status(201).json({ ok: true, id: result.rows[0].id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

function normalize(row) {
  return {
    ...row,
    total: Number(row.total),
    items: typeof row.items === 'string' ? JSON.parse(row.items) : row.items,
  }
}
