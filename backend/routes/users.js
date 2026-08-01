import { Router } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import pool from '../db.js'

const router = Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret'

function serializeUser(row) {
  return { id: row.id, name: row.name, email: row.email, createdAt: row.created_at }
}

function authMiddleware(req, res, next) {
  const h = req.headers.authorization || ''
  const m = h.match(/^Bearer (.+)$/)
  if (!m) return res.status(401).json({ ok: false, error: 'Missing token' })
  try {
    const payload = jwt.verify(m[1], JWT_SECRET)
    req.user = payload
    next()
  } catch (err) { return res.status(401).json({ ok: false, error: 'Invalid token' }) }
}

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, created_at FROM users ORDER BY created_at DESC')
    res.json(rows.map(serializeUser))
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Erreur serveur' })
  }
})

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.id])
    if (rows.length === 0) return res.status(404).json({ ok: false, error: 'Utilisateur introuvable' })
    res.json({ ok: true, user: serializeUser(rows[0]) })
  } catch (err) {
    console.error(err)
    res.status(500).json({ ok: false, error: 'Erreur serveur' })
  }
})

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ ok: false, error: 'Email et mot de passe requis' })
  try {
    const exists = await pool.query('SELECT id FROM users WHERE email = $1', [email])
    if (exists.rowCount > 0) return res.status(400).json({ ok: false, error: 'Utilisateur déjà existant' })
    const id = crypto.randomUUID()
    const hash = await bcrypt.hash(password, 10)
    await pool.query('INSERT INTO users(id, name, email, password_hash, created_at) VALUES($1,$2,$3,$4,now())', [id, name || null, email, hash])
    const token = jwt.sign({ id, email }, JWT_SECRET, { expiresIn: '30d' })
    res.json({ ok: true, token, user: { id, name, email } })
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: 'Erreur serveur' }) }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ ok: false, error: 'Email et mot de passe requis' })
  try {
    const r = await pool.query('SELECT id, name, email, password_hash FROM users WHERE email = $1', [email])
    if (r.rowCount === 0) return res.status(401).json({ ok: false, error: 'Identifiants invalides' })
    const user = r.rows[0]
    const match = await bcrypt.compare(password, user.password_hash)
    if (!match) return res.status(401).json({ ok: false, error: 'Identifiants invalides' })
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '30d' })
    res.json({ ok: true, token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: 'Erreur serveur' }) }
})

// Merge client_token-owned drafts/orders into this user account
router.post('/merge', authMiddleware, async (req, res) => {
  const { client_token } = req.body || {}
  if (!client_token) return res.status(400).json({ ok: false, error: 'client_token requis' })
  try {
    const userId = req.user.id
    await pool.query('UPDATE drafts SET user_id = $1 WHERE client_token = $2', [userId, client_token])
    await pool.query('UPDATE orders SET user_id = $1 WHERE client_token = $2', [userId, client_token])
    res.json({ ok: true })
  } catch (err) { console.error(err); res.status(500).json({ ok: false, error: 'Erreur serveur' }) }
})

export default router

