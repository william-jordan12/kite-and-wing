import 'dotenv/config'
import pg from 'pg'

const { Client } = pg
const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

await client.connect()
await client.query("DELETE FROM orders WHERE email = 'test@example.com'")
await client.query(`UPDATE settings SET value = '""' WHERE key = 'facebook'`)
console.log('cleaned test data')
await client.end()
