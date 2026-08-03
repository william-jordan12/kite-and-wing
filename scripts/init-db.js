import 'dotenv/config'
import pg from 'pg'
import { PRODUCTS } from '../src/data/store.js'

const { Client } = pg

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()

await client.query(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    type TEXT,
    size TEXT,
    price NUMERIC NOT NULL,
    description TEXT
  );
`)

await client.query(`
  CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    shipping TEXT,
    billing TEXT,
    payment_method TEXT NOT NULL,
    channel TEXT,
    total NUMERIC NOT NULL,
    items JSONB NOT NULL
  );
`)

await client.query(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL
  );
`)

const defaults = {
  email: 'kiteandwindsupply@gmail.com',
  whatsapp: '+15551234567',
  locations: ['California, USA', 'Vilnius, Lithuania'],
  facebook: '',
}

for (const [key, value] of Object.entries(defaults)) {
  await client.query(
    `INSERT INTO settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO NOTHING`,
    [key, JSON.stringify(value)]
  )
}

for (const p of PRODUCTS) {
  await client.query(
    `INSERT INTO products (id, name, brand, category, type, size, price, description)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (id) DO UPDATE SET
       name = EXCLUDED.name,
       brand = EXCLUDED.brand,
       category = EXCLUDED.category,
       type = EXCLUDED.type,
       size = EXCLUDED.size,
       price = EXCLUDED.price,
       description = EXCLUDED.description`,
    [p.id, p.name, p.brand, p.category, p.type, p.size, p.price, p.description]
  )
}

const counts = await client.query(
  `SELECT (SELECT COUNT(*) FROM products) AS products, (SELECT COUNT(*) FROM orders) AS orders`
)

console.log(`Schema ready. products=${counts.rows[0].products} orders=${counts.rows[0].orders}`)
await client.end()
