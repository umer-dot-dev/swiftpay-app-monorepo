import { Hono } from 'hono'
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'
import { v4 as uuidv4 } from 'uuid'
import { Bindings, User } from '../types'
import { hashPassword, comparePassword, generateToken } from '../services/authService'
import { createNotification } from '../services/notificationService'

const auth = new Hono<{ Bindings: Bindings }>()

// Schema for registration
const registerSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8)
})

// Schema for login
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
})

// POST /register
auth.post('/register', zValidator('json', registerSchema), async (c) => {
  const { full_name, email, password } = c.req.valid('json')

  // Check if user already exists
  const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?')
    .bind(email)
    .first()

  if (existingUser) {
    return c.json({ error: 'Conflict', message: 'Email already registered' }, 409)
  }

  // Hash password and create user
  const id = crypto.randomUUID() // Built-in for Workers
  const password_hash = await hashPassword(password)

  try {
    await c.env.DB.prepare(
      'INSERT INTO users (id, full_name, email, password_hash, balance) VALUES (?, ?, ?, ?, ?)'
    )
      .bind(id, full_name, email, password_hash, 0.00)
      .run()

    const token = await generateToken(id, c.env.JWT_SECRET)

    return c.json({
      message: 'Registration successful',
      token,
      user: { id, full_name, email, balance: 0 }
    }, 201)
  } catch (e: any) {
    return c.json({ error: 'Internal Server Error', message: e.message }, 500)
  }
})

// POST /login
auth.post('/login', zValidator('json', loginSchema), async (c) => {
  const { email, password } = c.req.valid('json')

  const user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email)
    .first<User>()

  if (!user) {
    return c.json({ error: 'Unauthorized', message: 'Invalid credentials' }, 401)
  }

  const isValid = await comparePassword(password, user.password_hash)

  if (!isValid) {
    return c.json({ error: 'Unauthorized', message: 'Invalid credentials' }, 401)
  }

  const token = await generateToken(user.id, c.env.JWT_SECRET)

  // Create login notification
  await createNotification(
    c.env.DB,
    user.id,
    'Login Recognized',
    `A new login was recognized for your account at ${new Date().toLocaleString()}`,
    'info'
  )

  return c.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      balance: user.balance,
      avatar_url: user.avatar_url
    }
  })
})

export default auth
