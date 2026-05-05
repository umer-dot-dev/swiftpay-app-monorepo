import { Hono } from 'hono'
import { cors } from 'hono/cors'
// Deployed on: 2026-05-05 16:03 PKT (Final Sync)
import { Bindings } from './types'
import auth from './routes/auth'
import accounts from './routes/accounts'
import transactions from './routes/transactions'
import cards from './routes/cards'
import notifications from './routes/notifications'

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
  credentials: true,
}))

// Global Error Handler
app.onError((err, c) => {
  console.error(`[Error]: ${err.message}`)
  return c.json({
    error: 'Internal Server Error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  }, 500)
})

// Routes
app.route('/auth', auth)
app.route('/accounts', accounts)
app.route('/transactions', transactions)
app.route('/cards', cards)
app.route('/notifications', notifications)

app.get('/', (c) => {
  return c.json({
    message: 'Welcome to SwiftPay API',
    version: '1.1.0'
  })
})

export default app
