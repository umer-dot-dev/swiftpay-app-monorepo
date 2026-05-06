import { Hono } from 'hono'
import { cors } from 'hono/cors'
// Deployed on: 2026-05-05 16:03 PKT (Final Sync)
import { Bindings } from './types'
import auth from './routes/auth'
import accounts from './routes/accounts'
import transactions from './routes/transactions'
import cards from './routes/cards'
import notifications from './routes/notifications'
import admin from './routes/admin'
import push from './routes/push'

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', cors())

// Routes
app.route('/auth', auth)
app.route('/accounts', accounts)
app.route('/transactions', transactions)
app.route('/cards', cards)
app.route('/notifications', notifications)
app.route('/admin', admin)
app.route('/push', push)

app.get('/', (c) => {
  return c.json({
    message: 'Welcome to SwiftPay API',
    version: '1.0.0'
  })
})

export default app
