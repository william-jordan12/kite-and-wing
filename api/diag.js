export async function GET(req, res) {
  const report = { ok: false, steps: [] }
  const step = (name, data) => report.steps.push({ name, ...data })

  try {
    step('import pg', {})
    const pgMod = await import('pg')
    const { Pool } = pgMod.default || pgMod
    step('pg imported', { version: (pgMod?.default?.version || 'unknown') })

    const raw = process.env.DATABASE_URL || ''
    step('DATABASE_URL', {
      set: Boolean(raw),
      hasPassword: raw.includes('npg_'),
      host: (raw.match(/@([^/]+)/) || [])[1] || '(none)',
      prefix: raw.slice(0, 20) + '...',
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
