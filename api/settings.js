import pool from './_db.js'
import { requireAuth, readBody } from './_auth.js'

const VALID = ['email', 'whatsapp', 'locations', 'facebook']

export async function GET(req, res) {
  try {
    const result = await pool.query('SELECT key, value FROM settings')
    const obj = {}
    for (const row of result.rows) {
      obj[row.key] = row.value
    }
    res.json(obj)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

export const PUT = requireAuth(async (req, res) => {
  try {
    const body = await readBody(req)
    for (const key of VALID) {
      if (body[key] !== undefined) {
        const value = Array.isArray(body[key]) ? body[key] : body[key]
        await pool.query(
          `INSERT INTO settings (key, value) VALUES ($1, $2)
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
          [key, JSON.stringify(value)]
        )
      }
    }
    const result = await pool.query('SELECT key, value FROM settings')
    const obj = {}
    for (const row of result.rows) {
      obj[row.key] = row.value
    }
    res.json(obj)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
