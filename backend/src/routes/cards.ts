import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { Bindings, Card } from '../types'

const cards = new Hono<{ Bindings: Bindings }>()

cards.use('*', authMiddleware)

// GET / - List user cards
cards.get('/', async (c) => {
  const userId = c.get('userId')
  
  const results = await c.env.DB.prepare(
    'SELECT * FROM cards WHERE user_id = ? ORDER BY created_at DESC'
  )
    .bind(userId)
    .all<Card>()

  return c.json(results.results)
})

// POST /issue - Create a new virtual card
cards.post('/issue', async (c) => {
  const userId = c.get('userId')
  
  // Get user name for card holder
  const user = await c.env.DB.prepare('SELECT full_name FROM users WHERE id = ?')
    .bind(userId)
    .first<{ full_name: string }>()

  if (!user) return c.json({ error: 'Not Found' }, 404)

  const id = crypto.randomUUID()
  // Generate a random-looking masked card number
  const last4 = Math.floor(1000 + Math.random() * 9000).toString()
  const card_number_masked = `**** **** **** ${last4}`
  
  // Set expiry to 3 years from now
  const expiry = new Date()
  expiry.setFullYear(expiry.getFullYear() + 3)
  const expiry_date = `${(expiry.getMonth() + 1).toString().padStart(2, '0')}/${expiry.getFullYear().toString().slice(-2)}`

  try {
    await c.env.DB.prepare(
      'INSERT INTO cards (id, user_id, card_number_masked, card_holder_name, expiry_date, card_type, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
      .bind(id, userId, card_number_masked, user.full_name, expiry_date, 'Visa Platinum', 'active')
      .run()

    return c.json({ message: 'Card issued successfully', cardId: id }, 201)
  } catch (e: any) {
    return c.json({ error: 'Internal Server Error', message: e.message }, 500)
  }
})

// PATCH /:id/toggle - Freeze/Unfreeze card
cards.patch('/:id/toggle', async (c) => {
  const userId = c.get('userId')
  const cardId = c.req.param('id')

  const card = await c.env.DB.prepare('SELECT status FROM cards WHERE id = ? AND user_id = ?')
    .bind(cardId, userId)
    .first<{ status: string }>()

  if (!card) return c.json({ error: 'Not Found' }, 404)

  const newStatus = card.status === 'active' ? 'frozen' : 'active'
  
  await c.env.DB.prepare('UPDATE cards SET status = ? WHERE id = ?')
    .bind(newStatus, cardId)
    .run()

  return c.json({ message: `Card ${newStatus}`, status: newStatus })
})

export default cards
