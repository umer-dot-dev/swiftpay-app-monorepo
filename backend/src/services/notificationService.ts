import { D1Database } from '@cloudflare/workers-types'

export async function createNotification(
  db: D1Database,
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) {
  const id = crypto.randomUUID()
  const now = new Date().toISOString()
  await db.prepare(
    'INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  )
    .bind(id, userId, title, message, type, 0, now)
    .run()
}
