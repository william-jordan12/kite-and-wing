import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const env = readFileSync(join(here, '.env'), 'utf8')
for (const line of env.split('\n')) {
  const m = line.match(/^([A-Z_]+)=(.*)$/)
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
}

const FILES_ONLY = process.argv.includes('--files-only')

const pool = (await import('./api/_db.js')).default
const outDir = join(here, 'public', 'images', 'products')
mkdirSync(outDir, { recursive: true })

const EXT = { png: 'png', jpeg: 'jpg', jpg: 'jpg', webp: 'webp', gif: 'gif' }
const slugify = (s) =>
  String(s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'photo'

const { rows } = await pool.query('SELECT id, image, images FROM products ORDER BY id')
let filesWritten = 0
let productsUpdated = 0

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

  const slug = slugify(row.id)
  const urls = []
  let idx = 0
  for (const entry of uniq) {
    if (!entry.startsWith('data:')) {
      urls.push(entry)
      continue
    }
    const m = entry.match(/^data:image\/(png|jpeg|jpg|webp|gif);base64,(.+)$/s)
    if (!m) continue
    const name = `${slug}-${String(idx).padStart(2, '0')}.${EXT[m[1]]}`
    writeFileSync(join(outDir, name), Buffer.from(m[2], 'base64'))
    filesWritten++
    urls.push(`/images/products/${name}`)
    idx++
  }
  if (!urls.length) continue

  const newImage = urls[0]
  const finalGallery = urls.slice(1)
  const imagesJson = finalGallery.length ? JSON.stringify(finalGallery) : null

  if (!FILES_ONLY) {
    await pool.query('UPDATE products SET image = $2, images = $3 WHERE id = $1', [
      row.id,
      newImage,
      imagesJson,
    ])
    productsUpdated++
  }
}

console.log(
  FILES_ONLY
    ? `wrote ${filesWritten} photo files to public/images/products/`
    : `wrote ${filesWritten} photo files, updated ${productsUpdated} products`
)
await pool.end()
