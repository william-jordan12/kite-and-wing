import crypto from 'node:crypto'
import { readFileSync, appendFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const LOG = join(here, 'kwbg', 'migrate.log')
const env = readFileSync(join(here, '.env'), 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
}

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME
const KEY = process.env.CLOUDINARY_API_KEY
const SECRET = process.env.CLOUDINARY_API_SECRET

const log = (msg) => {
  const line = `[${new Date().toISOString()}] ${msg}`
  try { appendFileSync(LOG, line + '\n') } catch {}
  console.log(msg)
}

async function uploadToCloudinary(dataUrl, publicId) {
  const timestamp = Math.floor(Date.now() / 1000)
  const params = { overwrite: 'true', public_id: publicId, timestamp: String(timestamp) }
  const toSign = Object.keys(params).sort().map(k => `${k}=${params[k]}`).join('&')
  const signature = crypto.createHash('sha1').update(toSign + SECRET).digest('hex')
  const body = new URLSearchParams({ file: dataUrl, api_key: KEY, ...params, signature })
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 60000)
  try {
    const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, { method: 'POST', body, signal: controller.signal })
    if (!r.ok) throw new Error(`Cloudinary ${r.status}: ${(await r.text()).slice(0, 120)}`)
    const data = await r.json()
    return data.secure_url
  } finally {
    clearTimeout(timer)
  }
}

const slugify = (s) =>
  String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'photo'

const pool = (await import('./api/_db.js')).default
const { rows } = await pool.query("SELECT id, image, images FROM products WHERE image LIKE 'data:%' OR images::text LIKE '%data:%' ORDER BY id")
log(`START: ${rows.length} products with base64 images`)

let uploaded = 0
let failed = 0
let updated = 0

async function processRow(row) {
  let gallery = []
  if (row.images) {
    try { const p = JSON.parse(row.images); gallery = Array.isArray(p) ? p : [] } catch {}
  }
  const entries = []
  if (row.image) entries.push(row.image)
  for (const g of gallery) entries.push(g)
  const seen = new Set()
  const uniq = entries.filter(e => { if (!e || seen.has(e)) return false; seen.add(e); return true })
  if (!uniq.length) return 'skip'

  const base = `kw/${slugify(row.id)}`
  const urls = []
  let idx = 0
  for (const entry of uniq) {
    if (!entry.startsWith('data:')) { urls.push(entry); continue }
    const publicId = `${base}-${String(idx).padStart(2, '0')}`
    urls.push(await uploadToCloudinary(entry, publicId))
    uploaded++
    idx++
  }
  const newImage = urls[0]
  const finalGallery = urls.slice(1)
  const imagesJson = finalGallery.length ? JSON.stringify(finalGallery) : null
  await pool.query('UPDATE products SET image=$2, images=$3 WHERE id=$1', [row.id, newImage, imagesJson])
  updated++
  return row.id
}

const CONC = 4
let cursor = 0
async function worker() {
  while (true) {
    const i = cursor++
    if (i >= rows.length) return
    const row = rows[i]
    try {
      const r = await processRow(row)
      if (r !== 'skip') log(`OK ${uploaded} [${updated}] ${row.id}`)
    } catch (e) {
      failed++
      log(`FAIL ${row.id}: ${e.message}`)
    }
  }
}

await Promise.all(Array.from({ length: CONC }, worker))
log(`DONE uploaded=${uploaded} failed=${failed} updated=${updated}`)
await pool.end()
