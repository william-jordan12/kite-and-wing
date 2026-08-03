import pool from './_db.js'
import { readBody, signToken, verifyPassword, parseSettingsString } from './_auth.js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    const { username, password } = await readBody(req)

    if (username !== (process.env.ADMIN_USER || 'admin')) {
      res.status(401).json({ error: 'Invalid credentials' })
      return
    }

    const stored = await getStoredPasswordHash()
    if (stored) {
      if (verifyPassword(password, stored)) {
        res.json({ token: signToken(username) })
      } else {
        res.status(401).json({ error: 'Invalid credentials' })
      }
      return
    }

    if (process.env.ADMIN_PASSWORD && password === process.env.ADMIN_PASSWORD) {
      res.json({ token: signToken(username) })
      return
    }

    res.status(401).json({ error: 'Invalid credentials' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

async function getStoredPasswordHash() {
  try {
    const result = await pool.query(`SELECT value FROM settings WHERE key = 'admin_password_hash'`)
    return result.rows.length ? parseSettingsString(result.rows[0].value) : null
  } catch {
    return null
  }
}
