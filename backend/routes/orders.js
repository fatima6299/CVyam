import { Router } from 'express'
import db from '../db.js'

const router = Router()

function rowToOrder(row) {
  return {
    id: row.id,
    client: { name: row.client_name, email: row.client_email, mode: row.mode },
    method: row.method,
    amount: row.amount,
    date: row.date,
    status: row.status,
    cvData: JSON.parse(row.cv_data)
  }
}

router.get('/', (req, res) => {
  const rows = db.prepare('SELECT * FROM orders ORDER BY date DESC').all()
  res.json(rows.map(rowToOrder))
})

router.get('/paid', (req, res) => {
  const { email } = req.query
  if (!email) return res.status(400).json({ error: 'email requis' })
  const row = db.prepare("SELECT * FROM orders WHERE client_email = ? AND status = 'paid' ORDER BY date DESC LIMIT 1").get(email)
  res.json(row ? rowToOrder(row) : null)
})

router.post('/', (req, res) => {
  const { client, method, amount, cvData } = req.body
  if (!client?.name || !client?.email || !method) {
    return res.status(400).json({ error: 'Champs manquants' })
  }
  const id = 'ORD-' + Date.now()
  const date = new Date().toISOString()
  db.prepare(`
    INSERT INTO orders (id, client_name, client_email, mode, method, amount, date, status, cv_data)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(id, client.name, client.email, client.mode || 'auto', method, amount || 0, date, JSON.stringify(cvData || {}))
  res.status(201).json({ id })
})

router.patch('/:id/validate', (req, res) => {
  const result = db.prepare("UPDATE orders SET status = 'paid' WHERE id = ?").run(req.params.id)
  if (result.changes === 0) return res.status(404).json({ error: 'Commande introuvable' })
  res.json({ ok: true })
})

export default router
