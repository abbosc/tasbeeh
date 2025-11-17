import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using offline mode.')
}

export const supabase = createClient(
  supabaseUrl || 'http://localhost:54321',
  supabaseAnonKey || 'dummy-key'
)

// Database types
export interface Counter {
  id: string
  user_id?: string
  name: string
  color: string
  icon: string
  created_at: string
}

export interface Session {
  id: string
  counter_id: string
  count: number
  goal: number | null
  completed: boolean
  date: string
  created_at: string
}

export interface DailyStats {
  id: string
  user_id?: string
  total_count: number
  date: string
  created_at: string
}
