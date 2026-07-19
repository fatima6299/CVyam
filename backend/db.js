import pg from 'pg'

const { Pool } = pg

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/cvbuilder',
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
})

await pool.query(`
  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    client_name TEXT NOT NULL,
    client_email TEXT NOT NULL,
    mode TEXT NOT NULL,
    method TEXT NOT NULL,
    amount INTEGER NOT NULL,
    date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    cv_data JSONB NOT NULL
  )
`)

export default pool
