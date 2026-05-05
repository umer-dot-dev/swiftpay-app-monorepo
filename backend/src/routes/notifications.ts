import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { Bindings, Notification } from '../types'

const notifications = new Hono<{ Bindings: Bindings }>()

notifications.use('*', authMiddleware)

// GET / - List user notifications
notifications.get('/', async (c) => {
  const userId = c.get('userId')
  
  const results = await c.env.DB.prepare(
    'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  )
    .bind(userId)
    .all<Notification>()

  return c.json(results.results)
})

// PATCH /:id/read - Mark as read
notifications.patch('/:id/read', async (c) => {
  const userId = c.get('userId')
  const notifyId = c.req.param('id')

  await c.env.DB.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?')
    .bind(notifyId, userId)
    .run()

  return c.json({ success: true })
})

// DELETE /clear - Delete all read notifications
notifications.delete('/clear', async (c) => {
  const userId = c.get('userId')

  await c.env.DB.prepare('DELETE FROM notifications WHERE user_id = ? AND is_read = 1')
    .bind(userId)
    .run()

  return c.json({ success: true })
})

export default notifications
