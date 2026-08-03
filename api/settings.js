import pool from './_db.js'
import { requireAuth, readBody } from './_auth.js'

const VALID = ['email', 'whatsapp', 'locations', 'facebook', 'instagram']

function publicSettings(rows) {
  const obj = {}
  for (const row of rows) {
    if (row.key.startsWith('admin_')) continue
    obj[row.key] = row.value
  }
  return obj
}

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const result = await pool.query('SELECT key, value FROM settings')
      res.json(publicSettings(result.rows))
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

const authedPut = requireAuth(async (req, res) => {
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
  res.json(publicSettings(result.rows))
})
