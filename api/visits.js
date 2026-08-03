import pool from './_db.js'
import { requireAuth, readBody } from './_auth.js'

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      await authedGet(req, res)
      return
    }
    if (req.method === 'POST') {
      await authedRead(req, res)
      return
    }
    res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const authedGet = requireAuth(async (req, res) => {
  const [visits, unread] = await Promise.all([
    pool.query(
      `SELECT id, created_at, path, referrer, user_agent, ip, is_read FROM visits ORDER BY id DESC LIMIT 50`
    ),
    pool.query(`SELECT COUNT(*)::int AS count FROM visits WHERE is_read = FALSE`),
  ])
  res.json({ visits: visits.rows, unread: unread.rows[0].count })
})

const authedRead = requireAuth(async (req, res) => {
  const body = await readBody(req)
  if (body.read === true) {
    await pool.query(`UPDATE visits SET is_read = TRUE WHERE is_read = FALSE`)
  }
  res.json({ ok: true })
})
