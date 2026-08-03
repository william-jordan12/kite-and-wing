import pool from './_db.js'

export default async function handler(req, res) {
  try {
    const result = await pool.query('SELECT 1 AS ok')
    res.json({ ok: true, value: result.rows[0].ok })
  } catch (err) {
    res.status(500).json({ ok: false, name: err.name, message: err.message, stack: String(err.stack).slice(0, 600) })
  }
}
