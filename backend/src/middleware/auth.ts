import { Context, Next } from 'hono'
import { verifyToken } from '../services/authService'
import { Bindings } from '../types'

export const authMiddleware = async (c: Context<{ Bindings: Bindings }>, next: Next) => {
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized', message: 'No token provided' }, 401)
  }

  const token = authHeader.split(' ')[1]
  const userId = await verifyToken(token, c.env.JWT_SECRET)

  if (userId) {
    // Check user status (Active vs Blocked)
    const user = await c.env.DB.prepare('SELECT status FROM users WHERE id = ?')
      .bind(userId)
      .first<{ status: string }>()

    if (user && user.status === 'blocked') {
      return c.json({ 
        error: 'Forbidden', 
        message: 'Your account has been restricted. Please contact support.',
        status: 'blocked'
      }, 403)
    }

    c.set('userId', userId)
    await next()
  } else {
    return c.json({ error: 'Unauthorized', message: 'Invalid or expired token' }, 401)
  }
}
