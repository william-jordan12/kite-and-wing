import pool from './_db.js'
import { requireAuth, readBody, verifyPassword, hashPassword, parseSettingsString } from './_auth.js'

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }
    await authed(req, res)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const authed = requireAuth(async (req, res) => {
  const { currentPassword, newPassword } = await readBody(req)
  if (!currentPassword || !newPassword) {
    res.status(400).json({ error: 'Current and new password are required' })
    return
  }
  if (String(newPassword).length < 8) {
    res.status(400).json({ error: 'New password must be at least 8 characters' })
    return
  }

  const stored = await getStoredPasswordHash()
  const valid =
    (stored && verifyPassword(currentPassword, stored)) ||
    (!stored && process.env.ADMIN_PASSWORD && currentPassword === process.env.ADMIN_PASSWORD)
  if (!valid) {
    res.status(401).json({ error: 'Current password is incorrect' })
    return
  }

  await pool.query(
    `INSERT INTO settings (key, value) VALUES ('admin_password_hash', $1)
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
    [JSON.stringify(hashPassword(newPassword))]
  )
  res.json({ ok: true })
})

async function getStoredPasswordHash() {
  try {
    const result = await pool.query(`SELECT value FROM settings WHERE key = 'admin_password_hash'`)
    return result.rows.length ? parseSettingsString(result.rows[0].value) : null
  } catch {
    return null
  }
}
