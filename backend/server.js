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

// Support comma-separated origins or '*' via CORS_ORIGIN env var.
const rawCors = process.env.CORS_ORIGIN || 'http://localhost:5173'
const allowedOrigins = rawCors.split(',').map(s => s.trim()).filter(Boolean)
console.log('Allowed CORS origins:', allowedOrigins)
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true)
    return callback(new Error('Not allowed by CORS'))
  },
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-token'],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  credentials: false
}))
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
