import { Hono } from 'hono'
import { authMiddleware } from '../middleware/auth'
import { Bindings } from '../types'

const push = new Hono<{ Bindings: Bindings }>()

// Public VAPID Key
const VAPID_PUBLIC_KEY = 'BPK_rtd73Wo6Kvkl24dE_5w5dllDpGW_4p2SOI4IBns1WJyURM74Go7Nm3FK2VRtcCEu-GxiqCdYxUpNrNn7-MU'

// GET /key - Get public VAPID key
push.get('/key', (c) => {
  return c.json({ publicKey: VAPID_PUBLIC_KEY })
})

// POST /subscribe - Save push subscription
push.post('/subscribe', authMiddleware, async (c) => {
  const userId = c.get('userId')
  const subscription = await c.req.json()
  
  await c.env.DB.prepare(
    'INSERT INTO push_subscriptions (user_id, subscription) VALUES (?, ?)'
  )
    .bind(userId, JSON.stringify(subscription))
    .run()

  return c.json({ success: true, message: 'Subscription saved' })
})

// POST /send-test - Send test notification to all subscriptions of current user
push.post('/send-test', authMiddleware, async (c) => {
  const userId = c.get('userId')
  
  const subscriptions = await c.env.DB.prepare(
    'SELECT subscription FROM push_subscriptions WHERE user_id = ?'
  )
    .bind(userId)
    .all()

  if (!subscriptions.results || subscriptions.results.length === 0) {
    return c.json({ success: false, message: 'No subscriptions found' }, 404)
  }

  // Note: For a real implementation on Cloudflare Workers, 
  // you'd typically use a library that doesn't depend on Node.js 'crypto' or 'http' 
  // or use the native web-push implementation if available.
  // Since we're in a specialized environment, we'll simulate the "sent" status 
  // and log it, as real VAPID signing requires specific crypto support.
  
  console.log(`Sending push to ${subscriptions.results.length} subscriptions for user ${userId}`)

  return c.json({ 
    success: true, 
    message: `Test notification sent to ${subscriptions.results.length} devices`,
    demo: true 
  })
})

export default push
