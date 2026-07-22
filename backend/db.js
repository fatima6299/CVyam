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

// Secret par appareil (généré côté client, jamais un mot de passe saisi) exigé pour retrouver un CV payé —
// empêche de consulter le CV de quelqu'un d'autre en devinant simplement son email.
await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_token TEXT`)

// Nombre de téléchargements déjà utilisés / autorisés pour cette commande (null = illimité, ex: mode gratuit).
await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS downloads_used INTEGER NOT NULL DEFAULT 0`)
await pool.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS download_limit INTEGER`)

// Brouillon en cours (avant paiement) sauvegardé par appareil, pour reprendre là où l'utilisateur s'est arrêté.
await pool.query(`
  CREATE TABLE IF NOT EXISTS drafts (
    client_token TEXT PRIMARY KEY,
    client_name TEXT,
    client_email TEXT,
    tpl_id TEXT,
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  )
`)

export default pool
