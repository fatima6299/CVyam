import { Router } from 'express'

const router = Router()

router.post('/admin', (req, res) => {
  const { code } = req.body
  if (code && code === process.env.ADMIN_CODE) {
    return res.json({ ok: true })
  }
  res.status(401).json({ ok: false, error: 'Code incorrect' })
})

export default router
