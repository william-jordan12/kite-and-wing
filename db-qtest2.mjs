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
const { rows } = await pool.query("SELECT id FROM products WHERE image LIKE 'data:%'")
console.log('image LIKE data only in', Date.now() - t, 'ms rows:', rows.length)
await pool.end()
