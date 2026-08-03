export default async function handler(req, res) {
  const report = { ok: false, steps: [] }
  const step = (name, data) => report.steps.push({ name, ...data })

  try {
    step('handler started', { method: req.method })
    const pgMod = await import('pg')
    const { Pool } = pgMod.default || pgMod
    step('pg imported', {})

    const raw = process.env.DATABASE_URL || ''
    step('DATABASE_URL', {
      set: Boolean(raw),
      hasPassword: raw.includes('npg_'),
      host: (raw.match(/@([^/]+)/) || [])[1] || '(none)',
    })

    const pool = new Pool({
      connectionString: raw,
      ssl: { rejectUnauthorized: false },
      max: 1,
      connectionTimeoutMillis: 8000,
    })
    const result = await pool.query('SELECT 1 AS ok')
    step('select 1', { value: result.rows[0].ok })
    await pool.end()
    report.ok = true
    res.json(report)
  } catch (err) {
    step('ERROR', { name: err.name, message: err.message })
    res.status(500).json(report)
  }
}
