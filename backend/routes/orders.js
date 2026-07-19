import { Router } from 'express'
import pool from '../db.js'

const router = Router()

function rowToOrder(row) {
  return {
    id: row.id,
    client: { name: row.client_name, email: row.client_email, mode: row.mode },
    method: row.method,
    amount: row.amount,
    date: row.date,
    status: row.status,
    cvData: row.cv_data
  }
}

router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders ORDER BY date DESC')
    res.json(rows.map(rowToOrder))
  } catch (err) { next(err) }
})

router.get('/paid', async (req, res, next) => {
  try {
    const { email, token } = req.query
    if (!email || !token) return res.status(400).json({ error: 'email et token requis' })
    const { rows } = await pool.query(
      "SELECT * FROM orders WHERE client_email = $1 AND client_token = $2 AND status = 'paid' ORDER BY date DESC LIMIT 1",
      [email, token]
    )
    res.json(rows[0] ? rowToOrder(rows[0]) : null)
  } catch (err) { next(err) }
})

router.post('/', async (req, res, next) => {
  try {
    const { client, method, amount, cvData } = req.body
    if (!client?.name || !client?.email || !client?.token || !method) {
      return res.status(400).json({ error: 'Champs manquants' })
    }
    const id = 'ORD-' + Date.now()
    const date = new Date().toISOString()
    await pool.query(
      `INSERT INTO orders (id, client_name, client_email, client_token, mode, method, amount, date, status, cv_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', $9)`,
      [id, client.name, client.email, client.token, client.mode || 'auto', method, amount || 0, date, JSON.stringify(cvData || {})]
    )
    res.status(201).json({ id })
  } catch (err) { next(err) }
})

router.patch('/:id/validate', async (req, res, next) => {
  try {
    const { rowCount } = await pool.query("UPDATE orders SET status = 'paid' WHERE id = $1", [req.params.id])
    if (rowCount === 0) return res.status(404).json({ error: 'Commande introuvable' })
    res.json({ ok: true })
  } catch (err) { next(err) }
})

export default router
