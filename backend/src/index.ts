import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Bindings } from './types'
import auth from './routes/auth'
import accounts from './routes/accounts'
import transactions from './routes/transactions'
import cards from './routes/cards'
import notifications from './routes/notifications'

const app = new Hono<{ Bindings: Bindings }>()

// Middleware
app.use('*', cors())

// Routes
app.route('/api/auth', auth)
app.route('/api/accounts', accounts)
app.route('/api/transactions', transactions)
app.route('/api/cards', cards)
app.route('/api/notifications', notifications)

app.get('/', (c) => {
  return c.json({
    message: 'Welcome to SwiftPay API',
    version: '1.0.0'
  })
})

export default app
