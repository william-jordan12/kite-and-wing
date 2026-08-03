import { createRequire } from 'node:module'

export default async function handler(req, res) {
  const report = { ok: false }
  try {
    const raw = process.env.DATABASE_URL || ''
    const redacted = raw.replace(/(npg_|postgres_)[A-Za-z0-9_-]*/g, '$1***')
    report.url = {
      set: Boolean(raw),
      length: raw.length,
      redacted,
      hasAt: raw.includes('@'),
      hasSlash: raw.includes('/'),
      hasQuestion: raw.includes('?'),
      parts: raw.split('@'),
    }
    res.status(200).json(report)
  } catch (err) {
    report.error = String(err.stack || err).slice(0, 500)
    res.status(500).json(report)
  }
}
