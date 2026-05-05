import { D1Database, KVNamespace } from '@cloudflare/workers-types'

export type Bindings = {
  DB: D1Database
  KV: KVNamespace
  JWT_SECRET: string
}

export interface User {
  id: string
  full_name: string
  email: string
  password_hash: string
  balance: number
  currency: string
  avatar_url?: string
  created_at: string
}

export interface Transaction {
  id: string
  sender_id?: string
  receiver_id?: string
  amount: number
  type: 'transfer' | 'receive' | 'bill_payment' | 'top_up'
  status: 'pending' | 'completed' | 'failed'
  description?: string
  created_at: string
}

export interface Card {
  id: string
  user_id: string
  card_number_masked: string
  card_holder_name: string
  expiry_date: string
  card_type: string
  status: 'active' | 'frozen' | 'expired'
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  is_read: boolean
  created_at: string
}
