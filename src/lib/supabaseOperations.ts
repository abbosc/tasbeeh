import { supabase, Counter, Session, DailyStats } from './supabase'

// Counter operations
export const fetchCountersFromSupabase = async (userId?: string) => {
  const { data, error } = await supabase
    .from('counters')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching counters:', error)
    return []
  }

  return data || []
}

export const saveCounterToSupabase = async (counter: Omit<Counter, 'id' | 'created_at'>, userId?: string) => {
  const { data, error } = await supabase
    .from('counters')
    .insert([{ ...counter, user_id: userId || null }])
    .select()
    .single()

  if (error) {
    console.error('Error saving counter:', error)
    return null
  }

  return data
}

export const updateCounterInSupabase = async (id: string, updates: Partial<Counter>) => {
  const { error } = await supabase
    .from('counters')
    .update(updates)
    .eq('id', id)

  if (error) {
    console.error('Error updating counter:', error)
    return false
  }

  return true
}

export const deleteCounterFromSupabase = async (id: string) => {
  const { error } = await supabase
    .from('counters')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting counter:', error)
    return false
  }

  return true
}

// Session operations
export const fetchSessionsFromSupabase = async (userId?: string) => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Error fetching sessions:', error)
    return []
  }

  return data || []
}

export const saveSessionToSupabase = async (session: Omit<Session, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('sessions')
    .insert([session])
    .select()
    .single()

  if (error) {
    console.error('Error saving session:', error)
    return null
  }

  return data
}

export const deleteSessionFromSupabase = async (id: string) => {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting session:', error)
    return false
  }

  return true
}

// Stats operations
export const fetchStatsFromSupabase = async (userId?: string) => {
  const { data, error } = await supabase
    .from('daily_stats')
    .select('*')
    .order('date', { ascending: false })
    .limit(90) // Last 90 days

  if (error) {
    console.error('Error fetching stats:', error)
    return []
  }

  return data || []
}

export const upsertDailyStatToSupabase = async (stat: Omit<DailyStats, 'id' | 'created_at'>, userId?: string) => {
  const today = new Date().toISOString().split('T')[0]

  // Check if stat exists for today
  const { data: existing } = await supabase
    .from('daily_stats')
    .select('*')
    .gte('date', today)
    .lt('date', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0])
    .maybeSingle()

  if (existing) {
    // Update existing stat
    const { error } = await supabase
      .from('daily_stats')
      .update({ total_count: existing.total_count + stat.total_count })
      .eq('id', existing.id)

    if (error) {
      console.error('Error updating daily stat:', error)
      return false
    }
  } else {
    // Insert new stat
    const { error } = await supabase
      .from('daily_stats')
      .insert([{ ...stat, user_id: userId || null }])

    if (error) {
      console.error('Error inserting daily stat:', error)
      return false
    }
  }

  return true
}

export const updateDailyStatCountInSupabase = async (date: string, countChange: number, userId?: string) => {
  const dateOnly = date.split('T')[0]
  const nextDay = new Date(new Date(dateOnly).setDate(new Date(dateOnly).getDate() + 1)).toISOString().split('T')[0]

  // Find existing stat for this specific date
  const { data: existing } = await supabase
    .from('daily_stats')
    .select('*')
    .gte('date', dateOnly)
    .lt('date', nextDay)
    .maybeSingle()

  if (existing) {
    const newCount = existing.total_count + countChange

    if (newCount <= 0) {
      // Delete the stat if count is 0 or less
      const { error } = await supabase
        .from('daily_stats')
        .delete()
        .eq('id', existing.id)

      if (error) {
        console.error('Error deleting daily stat:', error)
        return false
      }
    } else {
      // Update the count
      const { error } = await supabase
        .from('daily_stats')
        .update({ total_count: newCount })
        .eq('id', existing.id)

      if (error) {
        console.error('Error updating daily stat:', error)
        return false
      }
    }
  }

  return true
}

// Points operations
export const fetchPointsFromSupabase = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Error fetching points:', error)
    return 0
  }

  return data?.points || 0
}

export const updatePointsInSupabase = async (userId: string, points: number) => {
  const { data: existing } = await supabase
    .from('user_points')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (existing) {
    // Update existing
    const { error } = await supabase
      .from('user_points')
      .update({ points, updated_at: new Date().toISOString() })
      .eq('user_id', userId)

    if (error) {
      console.error('Error updating points:', error)
      return false
    }
  } else {
    // Insert new
    const { error } = await supabase
      .from('user_points')
      .insert([{ user_id: userId, points }])

    if (error) {
      console.error('Error inserting points:', error)
      return false
    }
  }

  return true
}

// Achievements operations
export const fetchAchievementsFromSupabase = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_achievements')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching achievements:', error)
    return []
  }

  return data?.map(a => a.achievement_id) || []
}

export const addAchievementToSupabase = async (userId: string, achievementId: string) => {
  const { error } = await supabase
    .from('user_achievements')
    .insert([{ user_id: userId, achievement_id: achievementId }])

  if (error) {
    console.error('Error adding achievement:', error)
    return false
  }

  return true
}

// Sync all data from Supabase
export const syncDataFromSupabase = async (userId?: string) => {
  const [counters, sessions, stats, points, achievements] = await Promise.all([
    fetchCountersFromSupabase(userId),
    fetchSessionsFromSupabase(userId),
    fetchStatsFromSupabase(userId),
    userId ? fetchPointsFromSupabase(userId) : Promise.resolve(0),
    userId ? fetchAchievementsFromSupabase(userId) : Promise.resolve([]),
  ])

  return { counters, sessions, stats, points, achievements }
}
