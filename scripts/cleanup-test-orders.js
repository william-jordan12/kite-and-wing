import 'dotenv/config'
import pg from 'pg'

const { Client } = pg
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()
const r = await client.query("DELETE FROM orders WHERE email = 'test@example.com'")
console.log('deleted test orders:', r.rowCount)
await client.end()
