import { Hono } from 'hono'
import { Bindings, User, Transaction } from '../types'

import { createNotification } from '../services/notificationService'

const admin = new Hono<{ Bindings: Bindings }>()

// Middleware for admin check (placeholder)
admin.use('*', async (c, next) => {
  // In a real app, check for admin role in JWT
  await next()
})

// GET /stats - Overall dashboard stats
admin.get('/stats', async (c) => {
  const userCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first('count')
  const transactionCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM transactions').first('count')
  const totalVolume = await c.env.DB.prepare('SELECT SUM(amount) as total FROM transactions').first('total') || 0
  
  // Recent registrations for chart
  const recentUsers = await c.env.DB.prepare('SELECT date(created_at) as date, COUNT(*) as count FROM users GROUP BY date(created_at) ORDER BY date DESC LIMIT 7').all()
  
  return c.json({
    users: userCount,
    transactions: transactionCount,
    volume: totalVolume,
    recentRegistrations: recentUsers.results
  })
})

// GET /users - List all users
admin.get('/users', async (c) => {
  const users = await c.env.DB.prepare('SELECT id, full_name, email, balance, status, created_at FROM users ORDER BY created_at DESC').all()
  return c.json(users.results)
})

// PATCH /users/:id/status - Block/Unblock user
admin.patch('/users/:id/status', async (c) => {
  const id = c.req.param('id')
  const { status } = await c.req.json()
  
  await c.env.DB.prepare('UPDATE users SET status = ? WHERE id = ?')
    .bind(status, id)
    .run()

  // Account status updated in DB, frontend will handle the persistent alert based on user.status
  return c.json({ success: true, message: `User status updated to ${status}` })
})

// DELETE /users/:id - Delete user
admin.delete('/users/:id', async (c) => {
  const id = c.req.param('id')
  
  // Also clean up related records to maintain integrity
  await c.env.DB.batch([
    c.env.DB.prepare('DELETE FROM push_subscriptions WHERE user_id = ?').bind(id),
    c.env.DB.prepare('DELETE FROM notifications WHERE user_id = ?').bind(id),
    c.env.DB.prepare('DELETE FROM cards WHERE user_id = ?').bind(id),
    c.env.DB.prepare('DELETE FROM transactions WHERE sender_id = ? OR receiver_id = ?').bind(id, id),
    c.env.DB.prepare('DELETE FROM users WHERE id = ?').bind(id)
  ])

  return c.json({ success: true, message: 'User and all related data deleted' })
})

// GET /transactions - List all transactions
admin.get('/transactions', async (c) => {
  const transactions = await c.env.DB.prepare(`
    SELECT t.*, u_from.full_name as sender_name, u_to.full_name as receiver_name 
    FROM transactions t
    LEFT JOIN users u_from ON t.sender_id = u_from.id
    LEFT JOIN users u_to ON t.receiver_id = u_to.id
    ORDER BY t.created_at DESC
  `).all()
  return c.json(transactions.results)
})

export default admin
