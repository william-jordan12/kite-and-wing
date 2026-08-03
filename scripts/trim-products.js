import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pg from 'pg'

dotenv.config()

const KEEP = [
  // Kiteboarding (15)
  'rebel-2026',
  'click-bar-2026',
  'xr7',
  'orbit-2026',
  'switchblade',
  'bandit',
  'edge-2026',
  'rs-2026',
  'lithium',
  'rally',
  'supermodel',
  'jaime-foil',
  'atmos',
  'xcaliber',
  'duotone-ts-freestyle-sls-2025-140cm',
  // Wing & Foiling (10)
  'unit-wing',
  'swing-wing',
  'armstrong-wing',
  'nova-wing',
  'naish-wing',
  'prism-wing',
  'axis-foil',
  'sabfoil',
  'kt-foil',
  'code-foil',
  // Windsurfing (6)
  'super-hero',
  's1',
  'rs-racing',
  'evo',
  'jp-air',
  'ezzy-wave',
]

if (KEEP.length !== 31) throw new Error(`Expected 31 products, got ${KEEP.length}`)

const EXTRA = {
  lithium: {
    name: 'Lithium 2026',
    brand: 'Airush',
    category: 'kiteboarding',
    type: 'Kite',
    size: '10m',
    price: 1729,
    description: 'High-aspect all-rounder with great low-end power and stability.',
    image: '',
  },
}

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BACKUP = path.join(__dirname, '..', '..', 'backup-products.json')

const client = new pg.Client({ connectionString: process.env.DATABASE_URL })

const run = async () => {
  await client.connect()
  const before = await client.query('SELECT id FROM products')
  fs.writeFileSync(BACKUP, JSON.stringify(before.rows, null, 2))
  console.log(`Backed up ${before.rows.length} products to ${BACKUP}`)

  const removed = before.rows.filter((r) => !KEEP.includes(r.id))
  for (const r of removed) {
    await client.query('DELETE FROM products WHERE id = $1', [r.id])
  }

  const missing = KEEP.filter((id) => !before.rows.some((r) => r.id === id))
  for (const id of missing) {
    const d = EXTRA[id]
    if (!d) throw new Error(`No data to insert missing product: ${id}`)
    await client.query(
      `INSERT INTO products (id, name, brand, category, type, size, price, description, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [id, d.name, d.brand, d.category, d.type, d.size, d.price, d.description, d.image]
    )
    console.log(`Inserted missing: ${id}`)
  }

  const after = await client.query('SELECT id, name, category FROM products ORDER BY category, id')
  console.log(`Remaining: ${after.rows.length}`)
  for (const row of after.rows) console.log(`  ${row.category} :: ${row.id} (${row.name})`)
  await client.end()
  if (after.rows.length !== 31) {
    console.error('WARNING: count is not 31!')
    process.exit(1)
  }
  console.log('OK: exactly 31 products.')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
