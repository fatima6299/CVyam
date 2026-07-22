import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import ordersRoutes from './routes/orders.js'
import draftsRoutes from './routes/drafts.js'

const app = express()

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }))
app.use(express.json({ limit: '8mb' }))

app.use('/api/auth', authRoutes)
app.use('/api/orders', ordersRoutes)
app.use('/api/drafts', draftsRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({ error: err.message || 'Erreur serveur' })
})

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`CVBuilder API en écoute sur http://localhost:${port}`))
