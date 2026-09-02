import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
const here = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(join(here, '.env'), 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}
const pool = (await import('./api/_db.js')).default
const { rows } = await pool.query("SELECT id, length(image) AS len FROM products WHERE image LIKE 'data:%' LIMIT 20")
for (const r of rows) console.log(r.id, Math.round(r.len / 1024) + 'KB')
const { rows: avg } = await pool.query("SELECT round(avg(length(image))/1024) AS avg_kb FROM products WHERE image LIKE 'data:%'")
console.log('avg KB:', avg[0].avg_kb)
await pool.end()
