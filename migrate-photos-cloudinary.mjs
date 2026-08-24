import crypto from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(join(here, '.env'), 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const CLOUD = process.env.CLOUDINARY_CLOUD_NAME
const KEY = process.env.CLOUDINARY_API_KEY
const SECRET = process.env.CLOUDINARY_API_SECRET

if (!CLOUD || !KEY || !SECRET) {
  console.log('Missing Cloudinary credentials in .env:')
  console.log('  CLOUDINARY_CLOUD_NAME=...')
  console.log('  CLOUDINARY_API_KEY=...')
  console.log('  CLOUDINARY_API_SECRET=...')
  process.exit(0)
}

async function uploadToCloudinary(dataUrl, publicId) {
  const timestamp = Math.floor(Date.now() / 1000)
  const params = { overwrite: 'true', public_id: publicId, timestamp: String(timestamp) }
  const toSign = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&')
  const signature = crypto.createHash('sha1').update(toSign + SECRET).digest('hex')

  const body = new URLSearchParams({
    file: dataUrl,
    api_key: KEY,
    ...params,
    signature,
  })
  const r = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`, {
    method: 'POST',
    body,
  })
  if (!r.ok) {
    throw new Error(`Cloudinary ${r.status}: ${(await r.text()).slice(0, 150)}`)
  }
  const data = await r.json()
  return data.secure_url
}

let pool
try {
  pool = (await import('./api/_db.js')).default
  await pool.query('SELECT 1')
} catch (e) {
  console.log('DATABASE STILL LOCKED —', e.message)
  process.exit(0)
}

const DRY_RUN = process.argv.includes('--dry-run')

const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'photo'

const { rows } = await pool.query('SELECT id, image, images FROM products ORDER BY id')
const links = {}
let uploaded = 0
let failed = 0
let updatedProducts = 0
const failures = []

for (const row of rows) {
  let gallery = []
  if (row.images) {
    try {
      const parsed = JSON.parse(row.images)
      gallery = Array.isArray(parsed) ? parsed : [row.images]
    } catch {
      gallery = [row.images]
    }
  }

  const entries = []
  if (row.image) entries.push(row.image)
  for (const g of gallery) entries.push(g)
  const seen = new Set()
  const uniq = entries.filter((e) => {
    if (!e || seen.has(e)) return false
    seen.add(e)
    return true
  })
  if (!uniq.length) continue

  const base = `kw/${slugify(row.id)}`
  const urls = []
  let idx = 0
  for (const entry of uniq) {
    if (!entry.startsWith('data:')) {
      urls.push(entry)
      continue
    }
    const publicId = `${base}-${String(idx).padStart(2, '0')}`
    try {
      if (DRY_RUN) {
        urls.push(`https://res.cloudinary.com/${CLOUD}/image/upload/${publicId}`)
      } else {
        urls.push(await uploadToCloudinary(entry, publicId))
      }
      uploaded++
      idx++
    } catch (e) {
      failed++
      failures.push(`${row.id} #${idx}: ${e.message}`)
      break
    }
  }
  if (!urls.length || failures.some((f) => f.startsWith(`${row.id} `))) continue

  const newImage = urls[0]
  const finalGallery = urls.slice(1)
  const imagesJson = finalGallery.length ? JSON.stringify(finalGallery) : null
  links[row.id] = { image: newImage, images: finalGallery }

  if (!DRY_RUN) {
    await pool.query('UPDATE products SET image = $2, images = $3 WHERE id = $1', [
      row.id,
      newImage,
      imagesJson,
    ])
    updatedProducts++
  }
}

writeFileSync(join(here, 'links.json'), JSON.stringify(links, null, 2))
console.log(
  `${DRY_RUN ? '[DRY RUN] ' : ''}uploaded=${uploaded} failed=${failed} productsUpdated=${updatedProducts}`
)
console.log('links.json written.')
if (failures.length) {
  console.log('Failures:')
  for (const f of failures.slice(0, 20)) console.log(' -', f)
}
await pool.end()
