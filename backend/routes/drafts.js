import { Router } from 'express'
import pool from '../db.js'

const router = Router()

router.get('/:token', async (req, res, next) => {
  try {
    const { rows } = await pool.query('SELECT * FROM drafts WHERE client_token = $1', [req.params.token])
    if (!rows[0]) return res.json(null)
    res.json({ tplId: rows[0].tpl_id, data: rows[0].data, updatedAt: rows[0].updated_at })
  } catch (err) { next(err) }
})

router.put('/:token', async (req, res, next) => {
  try {
    const { clientName, clientEmail, tplId, data } = req.body
    if (!data) return res.status(400).json({ error: 'data requis' })
    await pool.query(
      `INSERT INTO drafts (client_token, client_name, client_email, tpl_id, data, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (client_token) DO UPDATE SET
         client_name = EXCLUDED.client_name, client_email = EXCLUDED.client_email,
         tpl_id = EXCLUDED.tpl_id, data = EXCLUDED.data, updated_at = EXCLUDED.updated_at`,
      [req.params.token, clientName || null, clientEmail || null, tplId || null, JSON.stringify(data), new Date().toISOString()]
    )
    res.json({ ok: true })
  } catch (err) { next(err) }
})

export default router
