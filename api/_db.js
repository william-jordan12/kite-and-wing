import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Pool } = require('@neondatabase/serverless')

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

export default pool
