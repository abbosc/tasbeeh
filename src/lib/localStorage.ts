import { Counter, Session, DailyStats } from './supabase'

// Local storage keys
const KEYS = {
  COUNTERS: 'tasbeeh_counters',
  SESSIONS: 'tasbeeh_sessions',
  STATS: 'tasbeeh_stats',
  ACTIVE_SESSION: 'tasbeeh_active_session',
  POINTS: 'tasbeeh_points',
  ACHIEVEMENTS: 'tasbeeh_achievements',
  DARK_MODE: 'tasbeeh_dark_mode',
}

// Counter operations
export const saveCounters = (counters: Counter[]) => {
  localStorage.setItem(KEYS.COUNTERS, JSON.stringify(counters))
}

export const getCounters = (): Counter[] => {
  const data = localStorage.getItem(KEYS.COUNTERS)
  return data ? JSON.parse(data) : []
}

// Session operations
export const saveSessions = (sessions: Session[]) => {
  localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions))
}

export const getSessions = (): Session[] => {
  const data = localStorage.getItem(KEYS.SESSIONS)
  return data ? JSON.parse(data) : []
}

export const saveActiveSession = (counterId: string, count: number, goal: number | null) => {
  const activeSession = { counterId, count, goal, timestamp: new Date().toISOString() }
  localStorage.setItem(KEYS.ACTIVE_SESSION, JSON.stringify(activeSession))
}

export const getActiveSession = (counterId: string) => {
  const data = localStorage.getItem(KEYS.ACTIVE_SESSION)
  if (!data) return null
  const session = JSON.parse(data)
  return session.counterId === counterId ? session : null
}

export const clearActiveSession = () => {
  localStorage.removeItem(KEYS.ACTIVE_SESSION)
}

// Stats operations
export const saveStats = (stats: DailyStats[]) => {
  localStorage.setItem(KEYS.STATS, JSON.stringify(stats))
}

export const getStats = (): DailyStats[] => {
  const data = localStorage.getItem(KEYS.STATS)
  return data ? JSON.parse(data) : []
}

// Initialize default counters
export const initializeDefaultCounters = (): Counter[] => {
  const defaultCounters: Counter[] = [
    {
      id: '1',
      name: 'سبحان الله',
      color: 'green',
      icon: 'leaf',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'الحمد لله',
      color: 'teal',
      icon: 'heart',
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'الله أكبر',
      color: 'gold',
      icon: 'star',
      created_at: new Date().toISOString(),
    },
  ]
  saveCounters(defaultCounters)
  return defaultCounters
}

// Points operations
export const savePoints = (points: number) => {
  localStorage.setItem(KEYS.POINTS, points.toString())
}

export const getPoints = (): number => {
  const data = localStorage.getItem(KEYS.POINTS)
  return data ? parseInt(data, 10) : 0
}

export const addPoints = (points: number) => {
  const current = getPoints()
  savePoints(current + points)
  return current + points
}

// Achievements operations
export const saveAchievements = (achievements: string[]) => {
  localStorage.setItem(KEYS.ACHIEVEMENTS, JSON.stringify(achievements))
}

export const getAchievements = (): string[] => {
  const data = localStorage.getItem(KEYS.ACHIEVEMENTS)
  return data ? JSON.parse(data) : []
}

export const unlockAchievement = (achievementId: string) => {
  const achievements = getAchievements()
  if (!achievements.includes(achievementId)) {
    achievements.push(achievementId)
    saveAchievements(achievements)
    return true
  }
  return false
}

// Dark mode operations
export const saveDarkMode = (enabled: boolean) => {
  localStorage.setItem(KEYS.DARK_MODE, enabled.toString())
}

export const getDarkMode = (): boolean => {
  const data = localStorage.getItem(KEYS.DARK_MODE)
  return data === 'true'
}
