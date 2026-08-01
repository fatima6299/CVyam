import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import authRoutes from './routes/auth.js'
import usersRoutes from './routes/users.js'
import ordersRoutes from './routes/orders.js'
import draftsRoutes from './routes/drafts.js'

const app = express()

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de requêtes, réessayez dans quelques minutes' }
})

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Trop de tentatives, réessayez dans quelques minutes' }
})

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '8mb' }))
app.use(limiter)

app.use('/api/auth', adminLimiter, authRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/drafts', draftsRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Erreur serveur' })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`CVBuilder API en écoute sur http://localhost:${port}`))
