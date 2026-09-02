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
const { rows } = await pool.query("SELECT COUNT(*) FILTER (WHERE image LIKE 'https://res.cloudinary.com%') AS cloud, COUNT(*) FILTER (WHERE image LIKE 'data:%') AS b64, COUNT(*) AS total FROM products")
console.log(JSON.stringify(rows[0]))
if (rows[0].cloud > 0) {
  const { rows: sample } = await pool.query("SELECT id FROM products WHERE image LIKE 'https://res.cloudinary.com%' LIMIT 3")
  console.log('Cloudinary migrados:', sample.map(r => r.id).join(', '))
}
await pool.end()
