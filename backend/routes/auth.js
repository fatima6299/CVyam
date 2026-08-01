import { Router } from 'express'
import crypto from 'crypto'

const router = Router()

function hashCode(code) {
  return crypto.createHash('sha256').update(code, 'utf8').digest('hex')
}

router.post('/admin', (req, res) => {
  const { code } = req.body
  if (!code) return res.status(400).json({ ok: false, error: 'Code requis' })
  const submittedHash = hashCode(code)
  const storedHash = process.env.ADMIN_CODE_HASH
  if (!submittedHash || !storedHash) {
    return res.status(500).json({ ok: false, error: 'Configuration serveur invalide' })
  }
  const submittedBuf = Buffer.from(submittedHash, 'hex')
  const storedBuf = Buffer.from(storedHash, 'hex')
  if (submittedBuf.length !== storedBuf.length) {
    return res.status(401).json({ ok: false, error: 'Code incorrect' })
  }
  if (!crypto.timingSafeEqual(submittedBuf, storedBuf)) {
    return res.status(401).json({ ok: false, error: 'Code incorrect' })
  }
  res.json({ ok: true })
})

export default router
