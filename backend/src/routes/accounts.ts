import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { Bindings, User } from '../types'

const accounts = new Hono<{ Bindings: Bindings }>()

// Apply auth middleware to all account routes
accounts.use('*', authMiddleware)

// GET /balance
accounts.get('/balance', async (c) => {
  const userId = c.get('userId')
  
  const user = await c.env.DB.prepare('SELECT balance, currency FROM users WHERE id = ?')
    .bind(userId)
    .first<{ balance: number, currency: string }>()

  if (!user) {
    return c.json({ error: 'Not Found', message: 'User not found' }, 404)
  }

  // Formatting account number for UI (mock formatted)
  return c.json({
    userId,
    balance: user.balance,
    currency: user.currency,
    accountNumber: `**** **** **** ${userId.slice(-4)}`,
    accountType: 'Savings'
  })
})

// GET /profile
accounts.get('/profile', async (c) => {
  const userId = c.get('userId')
  
  const user = await c.env.DB.prepare('SELECT id, full_name, email, balance, currency, avatar_url FROM users WHERE id = ?')
    .bind(userId)
    .first<User>()

  if (!user) {
    return c.json({ error: 'Not Found', message: 'User not found' }, 404)
  }

  return c.json(user)
})

export default accounts
