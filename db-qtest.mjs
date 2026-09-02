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
let t = Date.now()
const { rows } = await pool.query("SELECT id, image, images FROM products WHERE image LIKE 'data:%' OR images::text LIKE '%data:%' ORDER BY id")
console.log('query took', Date.now() - t, 'ms, rows:', rows.length)
const total = rows.reduce((a, r) => a + (r.image || '').length + (r.images ? JSON.stringify(r.images).length : 0), 0)
console.log('approx MB:', Math.round(total / 1024 / 1024))
await pool.end()
