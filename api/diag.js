import { createRequire } from 'node:module'

function safe(v) {
  try {
    return JSON.stringify(v)
  } catch {
    return String(v)
  }
}

export default async function handler(req, res) {
  const report = { ok: false, steps: [] }
  const step = (name, data) => report.steps.push({ name, ...data })
  try {
    const raw = process.env.DATABASE_URL || ''
    const host = (raw.match(/@([^/:]+)/) || [])[1] || '(none)'
    const db = (raw.match(/\/([^/?]+)\?/) || raw.match(/\/([^/?]+)$/) || [])[1] || '(none)'
    const params = (raw.split('?')[1] || '').split('&').map((p) => p.split('=')[0]).filter(Boolean)
    step('DATABASE_URL', {
      set: Boolean(raw),
      host,
      db,
      params,
      length: raw.length,
      starts: raw.slice(0, 8),
    })

    const require = createRequire(import.meta.url)
    const { Pool } = require('@neondatabase/serverless')
    const pool = new Pool({ connectionString: raw, max: 1 })
    const r = await pool.query('SELECT 1 AS ok')
    step('select 1', { value: r.rows[0].ok })
    await pool.end()
    report.ok = true
    res.json(report)
  } catch (err) {
    const chain = []
    let e = err
    for (let i = 0; e && i < 4; i++) {
      chain.push({ name: e.name, code: e.code, message: String(e.message || '').slice(0, 300), constructor: e.constructor?.name })
      e = e.cause
    }
    step('ERROR', { chain, stack: String(err.stack).slice(0, 1200) })
    res.status(500).json(report)
  }
}
