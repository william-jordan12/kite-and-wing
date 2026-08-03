import { createRequire } from 'node:module'

export default async function handler(req, res) {
  const report = { ok: false, steps: [] }
  const step = (name, data) => report.steps.push({ name, ...data })
  try {
    const require = createRequire(import.meta.url)
    step('createRequire ok', {})
    const { Pool } = require('@neondatabase/serverless')
    step('neon driver loaded', {})
    const pool = new Pool({ connectionString: process.env.DATABASE_URL })
    step('pool created', { urlSet: Boolean(process.env.DATABASE_URL) })
    const r = await pool.query('SELECT 1 AS ok')
    step('select 1', { value: r.rows[0].ok })
    await pool.end()
    report.ok = true
    res.json(report)
  } catch (err) {
    step('ERROR', { name: err.name, message: err.message, stack: String(err.stack).slice(0, 800) })
    res.status(500).json(report)
  }
}
