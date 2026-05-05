import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { authMiddleware } from '../middleware/auth'
import { Bindings, Transaction } from '../types'
import { createNotification } from '../services/notificationService'

const transactions = new Hono<{ Bindings: Bindings }>()

transactions.use('*', authMiddleware)

// Schema for transfer
const transferSchema = z.object({
  recipientEmail: z.string().email(),
  amount: z.number().positive(),
  description: z.string().optional()
})

// Schema for top-up
const topupSchema = z.object({
  amount: z.number().positive()
})

// GET / - Fetch transaction history
transactions.get('/', async (c) => {
  const userId = c.get('userId')
  
  const results = await c.env.DB.prepare(
    `SELECT * FROM transactions 
     WHERE sender_id = ? OR receiver_id = ? 
     ORDER BY created_at DESC LIMIT 50`
  )
    .bind(userId, userId)
    .all<Transaction>()

  return c.json(results.results)
})

// POST /transfer - Send money
transactions.post('/transfer', zValidator('json', transferSchema), async (c) => {
  const userId = c.get('userId')
  const { recipientEmail, amount, description } = c.req.valid('json')

  // 1. Find recipient
  const recipient = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(recipientEmail)
    .first<{ id: string }>()

  if (!recipient) {
    return c.json({ error: 'Not Found', message: 'Recipient not found' }, 404)
  }

  if (recipient.id === userId) {
    return c.json({ error: 'Bad Request', message: 'Cannot send money to yourself' }, 400)
  }

  // 2. Check sender balance
  const sender = await c.env.DB.prepare('SELECT balance FROM users WHERE id = ?')
    .bind(userId)
    .first<{ balance: number }>()

  if (!sender || sender.balance < amount) {
    return c.json({ error: 'Forbidden', message: 'Insufficient balance' }, 403)
  }

  // 3. Perform Atomic Transaction (D1 batch)
  const txId = crypto.randomUUID()
  
  try {
    await c.env.DB.batch([
      // Deduct from sender
      c.env.DB.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').bind(amount, userId),
      // Add to receiver
      c.env.DB.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').bind(amount, recipient.id),
      // Create transaction record
      c.env.DB.prepare(
        'INSERT INTO transactions (id, sender_id, receiver_id, amount, type, description) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(txId, userId, recipient.id, amount, 'transfer', description || 'Funds Transfer')
    ])

    // Create notifications
    await Promise.all([
      createNotification(
        c.env.DB,
        userId,
        'Payment Sent',
        `You successfully sent Rs ${amount.toLocaleString()} to ${recipientEmail}.`,
        'success'
      ),
      createNotification(
        c.env.DB,
        recipient.id,
        'Payment Received',
        `You received Rs ${amount.toLocaleString()} from a SwiftPay user.`,
        'success'
      )
    ])

    return c.json({ message: 'Transfer successful', transactionId: txId })
  } catch (e: any) {
    return c.json({ error: 'Internal Server Error', message: 'Transaction failed' }, 500)
  }
})

// POST /top-up - Add money to account
transactions.post('/top-up', zValidator('json', topupSchema), async (c) => {
  const userId = c.get('userId')
  const { amount } = c.req.valid('json')
  const txId = crypto.randomUUID()

  try {
    await c.env.DB.batch([
      c.env.DB.prepare('UPDATE users SET balance = balance + ? WHERE id = ?').bind(amount, userId),
      c.env.DB.prepare(
        'INSERT INTO transactions (id, receiver_id, amount, type, description) VALUES (?, ?, ?, ?, ?)'
      ).bind(txId, userId, amount, 'top_up', 'Account Top-Up')
    ])

    await createNotification(
      c.env.DB,
      userId,
      'Top-up Successful',
      `Rs ${amount.toLocaleString()} has been added to your account.`,
      'success'
    )

    return c.json({ message: 'Top-up successful', transactionId: txId })
  } catch (e: any) {
    return c.json({ error: 'Internal Server Error', message: 'Top-up failed' }, 500)
  }
})

// POST /bill-payment - Pay utility bills
transactions.post('/bill-payment', zValidator('json', z.object({
  amount: z.number().positive(),
  description: z.string()
})), async (c) => {
  const userId = c.get('userId')
  const { amount, description } = c.req.valid('json')
  const txId = crypto.randomUUID()

  const user = await c.env.DB.prepare('SELECT balance FROM users WHERE id = ?').bind(userId).first<{ balance: number }>()
  if (!user || user.balance < amount) {
    return c.json({ error: 'Forbidden', message: 'Insufficient balance' }, 403)
  }

  try {
    await c.env.DB.batch([
      c.env.DB.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').bind(amount, userId),
      c.env.DB.prepare(
        'INSERT INTO transactions (id, sender_id, amount, type, description) VALUES (?, ?, ?, ?, ?)'
      ).bind(txId, userId, amount, 'bill_payment', description)
    ])

    await createNotification(
      c.env.DB,
      userId,
      'Bill Paid',
      `Payment of Rs ${amount.toLocaleString()} for ${description} was successful.`,
      'success'
    )

    return c.json({ message: 'Bill payment successful', transactionId: txId })
  } catch (e: any) {
    return c.json({ error: 'Internal Server Error', message: 'Bill payment failed' }, 500)
  }
})

// POST /recharge - Mobile recharge
transactions.post('/recharge', zValidator('json', z.object({
  amount: z.number().positive(),
  phoneNumber: z.string()
})), async (c) => {
  const userId = c.get('userId')
  const { amount, phoneNumber } = c.req.valid('json')
  const txId = crypto.randomUUID()

  const user = await c.env.DB.prepare('SELECT balance FROM users WHERE id = ?').bind(userId).first<{ balance: number }>()
  if (!user || user.balance < amount) {
    return c.json({ error: 'Forbidden', message: 'Insufficient balance' }, 403)
  }

  try {
    await c.env.DB.batch([
      c.env.DB.prepare('UPDATE users SET balance = balance - ? WHERE id = ?').bind(amount, userId),
      c.env.DB.prepare(
        'INSERT INTO transactions (id, sender_id, amount, type, description) VALUES (?, ?, ?, ?, ?)'
      ).bind(txId, userId, amount, 'recharge', `Mobile Recharge: ${phoneNumber}`)
    ])

    await createNotification(
      c.env.DB,
      userId,
      'Recharge Successful',
      `Mobile recharge of Rs ${amount.toLocaleString()} for ${phoneNumber} was successful.`,
      'success'
    )

    return c.json({ message: 'Recharge successful', transactionId: txId })
  } catch (e: any) {
    return c.json({ error: 'Internal Server Error', message: 'Recharge failed' }, 500)
  }
})

export default transactions
