import pool from './_db.js'
import { readBody } from './_auth.js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }
    const { path = '', referrer = '', userAgent = '' } = await readBody(req)
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || ''
    if (path) {
      await pool.query(
        `INSERT INTO visits (path, referrer, user_agent, ip) VALUES ($1, $2, $3, $4)`,
        [
          String(path).slice(0, 200),
          String(referrer).slice(0, 500),
          String(userAgent).slice(0, 500),
          String(ip).slice(0, 64),
        ]
      )
    }
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
