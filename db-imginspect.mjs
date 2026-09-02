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
const { rows } = await pool.query("SELECT id, left(image, 60) AS prefix, length(image) AS len, image LIKE 'data:%' AS b64, image LIKE '/api%' AS proxy, image LIKE 'http%' AS http FROM products WHERE image IS NOT NULL AND image != ''")
console.log('rows with image:', rows.length)
const http = rows.filter(r => r.http)
const b64 = rows.filter(r => r.b64)
const proxy = rows.filter(r => r.proxy)
const other = rows.filter(r => !r.http && !r.b64 && !r.proxy)
console.log('http:', http.length, 'b64:', b64.length, 'proxy:', proxy.length, 'other:', other.length)
console.log('\nSample http prefixes:')
http.slice(0, 8).forEach(r => console.log(' ', r.id, '→', r.prefix))
console.log('\nSample other (first 8):')
other.slice(0, 8).forEach(r => console.log(' ', r.id, '→', JSON.stringify(r.prefix)))
console.log('\nEmpty-image product count check + gallery variety:')
const g = await pool.query("SELECT COUNT(*) AS n, COUNT(images) AS has_g, COUNT(images) FILTER (WHERE images::text LIKE '%data:%') AS gb64 FROM products")
console.log(JSON.stringify(g.rows[0]))
await pool.end()
