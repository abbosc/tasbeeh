import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Counter, Session, DailyStats } from '../lib/supabase'
import {
  getCounters,
  saveCounters,
  getSessions,
  saveSessions,
  getStats,
  saveStats,
  initializeDefaultCounters,
  saveActiveSession,
  getActiveSession,
  clearActiveSession,
} from '../lib/localStorage'
import {
  syncDataFromSupabase,
  saveCounterToSupabase,
  updateCounterInSupabase,
  deleteCounterFromSupabase,
  saveSessionToSupabase,
  deleteSessionFromSupabase,
  upsertDailyStatToSupabase,
  updateDailyStatCountInSupabase,
} from '../lib/supabaseOperations'
import { useAuth } from './AuthContext'

interface TasbeehContextType {
  counters: Counter[]
  activeCounter: Counter | null
  currentCount: number
  currentGoal: number | null
  sessions: Session[]
  stats: DailyStats[]
  soundEnabled: boolean
  hapticsEnabled: boolean
  syncing: boolean
  deleteSession: (id: string) => void
  setActiveCounter: (counter: Counter) => void
  incrementCount: () => void
  resetCount: () => void
  setGoal: (goal: number | null) => void
  addCounter: (counter: Omit<Counter, 'id' | 'created_at'>) => void
  updateCounter: (id: string, updates: Partial<Counter>) => void
  deleteCounter: (id: string) => void
  toggleSound: () => void
  toggleHaptics: () => void
  completeSession: () => void
  saveSessionManually: (session: Omit<Session, 'id' | 'created_at'>) => void
}

const TasbeehContext = createContext<TasbeehContextType | undefined>(undefined)

export const TasbeehProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isGuest } = useAuth()
  const [counters, setCounters] = useState<Counter[]>([])
  const [activeCounter, setActiveCounterState] = useState<Counter | null>(null)
  const [currentCount, setCurrentCount] = useState(0)
  const [currentGoal, setCurrentGoal] = useState<number | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState<DailyStats[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [hapticsEnabled, setHapticsEnabled] = useState(true)
  const [syncing, setSyncing] = useState(false)

  // Initialize and sync data
  useEffect(() => {
    const initializeData = async () => {
      setSyncing(true)

      // If user is authenticated, sync from Supabase
      if (user && !isGuest) {
        try {
          const { counters: supabaseCounters, sessions: supabaseSessions, stats: supabaseStats } =
            await syncDataFromSupabase(user.id)

          if (supabaseCounters.length > 0) {
            setCounters(supabaseCounters)
            saveCounters(supabaseCounters) // Also save to localStorage as backup
            setActiveCounterState(supabaseCounters[0])
          } else {
            // No counters in Supabase, initialize defaults and upload
            const defaultCounters = initializeDefaultCounters()
            setCounters(defaultCounters)
            setActiveCounterState(defaultCounters[0])

            // Upload default counters to Supabase
            for (const counter of defaultCounters) {
              await saveCounterToSupabase(
                { name: counter.name, color: counter.color, icon: counter.icon },
                user.id
              )
            }
          }

          setSessions(supabaseSessions)
          saveSessions(supabaseSessions)

          setStats(supabaseStats)
          saveStats(supabaseStats)
        } catch (error) {
          console.error('Error syncing from Supabase:', error)
          // Fall back to localStorage
          loadFromLocalStorage()
        }
      } else {
        // Guest mode - use localStorage
        loadFromLocalStorage()
      }

      setSyncing(false)
    }

    initializeData()
  }, [user, isGuest])

  const loadFromLocalStorage = () => {
    let loadedCounters = getCounters()
    if (loadedCounters.length === 0) {
      loadedCounters = initializeDefaultCounters()
    }
    setCounters(loadedCounters)
    setActiveCounterState(loadedCounters[0])

    setSessions(getSessions())
    setStats(getStats())

    // Load active session for first counter
    if (loadedCounters[0]) {
      const activeSession = getActiveSession(loadedCounters[0].id)
      if (activeSession) {
        setCurrentCount(activeSession.count)
        setCurrentGoal(activeSession.goal)
      }
    }
  }

  const setActiveCounter = (counter: Counter) => {
    // Save current session before switching
    if (activeCounter) {
      saveActiveSession(activeCounter.id, currentCount, currentGoal)
    }

    setActiveCounterState(counter)

    // Load session for new counter
    const session = getActiveSession(counter.id)
    if (session) {
      setCurrentCount(session.count)
      setCurrentGoal(session.goal)
    } else {
      setCurrentCount(0)
      setCurrentGoal(null)
    }
  }

  const incrementCount = () => {
    setCurrentCount((prev) => prev + 1)

    // Save to localStorage
    if (activeCounter) {
      saveActiveSession(activeCounter.id, currentCount + 1, currentGoal)
    }
  }

  const resetCount = () => {
    setCurrentCount(0)
    setCurrentGoal(null)

    if (activeCounter) {
      clearActiveSession()
    }
  }

  const setGoal = (goal: number | null) => {
    setCurrentGoal(goal)

    if (activeCounter) {
      saveActiveSession(activeCounter.id, currentCount, goal)
    }
  }

  const completeSession = async () => {
    if (!activeCounter) return

    const newSession: Session = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      counter_id: activeCounter.id,
      count: currentCount,
      goal: currentGoal,
      completed: currentGoal ? currentCount >= currentGoal : false,
      date: new Date().toISOString(),
      created_at: new Date().toISOString(),
    }

    const updatedSessions = [newSession, ...sessions]
    setSessions(updatedSessions)
    saveSessions(updatedSessions)

    // Save to Supabase if authenticated
    if (user && !isGuest) {
      await saveSessionToSupabase({
        counter_id: newSession.counter_id,
        count: newSession.count,
        goal: newSession.goal,
        completed: newSession.completed,
        date: newSession.date,
      })
    }

    // Update daily stats
    const today = new Date().toISOString().split('T')[0]
    const existingStatIndex = stats.findIndex((s) => s.date.startsWith(today))

    let updatedStats: DailyStats[]
    if (existingStatIndex >= 0) {
      updatedStats = [...stats]
      updatedStats[existingStatIndex] = {
        ...updatedStats[existingStatIndex],
        total_count: updatedStats[existingStatIndex].total_count + currentCount,
      }
    } else {
      const newStat: DailyStats = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        total_count: currentCount,
        date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      }
      updatedStats = [newStat, ...stats]
    }

    setStats(updatedStats)
    saveStats(updatedStats)

    // Save to Supabase if authenticated
    if (user && !isGuest) {
      await upsertDailyStatToSupabase(
        {
          total_count: currentCount,
          date: new Date().toISOString(),
        },
        user.id
      )
    }

    // Reset current session
    resetCount()
  }

  const deleteSession = async (id: string) => {
    // Find the session to get its count and date before deleting
    const sessionToDelete = sessions.find((s) => s.id === id)
    if (!sessionToDelete) return

    // Delete from Supabase if authenticated
    if (user && !isGuest) {
      await deleteSessionFromSupabase(id)
    }

    const updatedSessions = sessions.filter((s) => s.id !== id)
    setSessions(updatedSessions)
    saveSessions(updatedSessions)

    // Update daily stats to subtract the deleted session's count
    const sessionDate = sessionToDelete.date.split('T')[0]
    const statIndex = stats.findIndex((s) => s.date.startsWith(sessionDate))

    if (statIndex >= 0) {
      const updatedStats = [...stats]
      const newCount = updatedStats[statIndex].total_count - sessionToDelete.count

      if (newCount <= 0) {
        // Remove the stat entry if count reaches 0
        updatedStats.splice(statIndex, 1)
      } else {
        // Update the count
        updatedStats[statIndex] = {
          ...updatedStats[statIndex],
          total_count: newCount,
        }
      }

      setStats(updatedStats)
      saveStats(updatedStats)

      // Update in Supabase if authenticated
      if (user && !isGuest) {
        await updateDailyStatCountInSupabase(
          sessionToDelete.date,
          -sessionToDelete.count, // Negative to subtract
          user.id
        )
      }
    }
  }

  const addCounter = async (counterData: Omit<Counter, 'id' | 'created_at'>) => {
    // If authenticated, save to Supabase first
    if (user && !isGuest) {
      const savedCounter = await saveCounterToSupabase(counterData, user.id)
      if (savedCounter) {
        const updatedCounters = [...counters, savedCounter]
        setCounters(updatedCounters)
        saveCounters(updatedCounters)
        return
      }
    }

    // Fallback to local storage
    const newCounter: Counter = {
      ...counterData,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      created_at: new Date().toISOString(),
    }

    const updatedCounters = [...counters, newCounter]
    setCounters(updatedCounters)
    saveCounters(updatedCounters)
  }

  const updateCounter = async (id: string, updates: Partial<Counter>) => {
    // Update in Supabase if authenticated
    if (user && !isGuest) {
      await updateCounterInSupabase(id, updates)
    }

    const updatedCounters = counters.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    )
    setCounters(updatedCounters)
    saveCounters(updatedCounters)

    if (activeCounter?.id === id) {
      setActiveCounterState({ ...activeCounter, ...updates })
    }
  }

  const deleteCounter = async (id: string) => {
    // Delete from Supabase if authenticated
    if (user && !isGuest) {
      await deleteCounterFromSupabase(id)
    }

    const updatedCounters = counters.filter((c) => c.id !== id)
    setCounters(updatedCounters)
    saveCounters(updatedCounters)

    if (activeCounter?.id === id && updatedCounters.length > 0) {
      setActiveCounter(updatedCounters[0])
    }
  }

  const saveSessionManually = async (sessionData: Omit<Session, 'id' | 'created_at'>) => {
    const newSession: Session = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      ...sessionData,
      created_at: new Date().toISOString(),
    }

    const updatedSessions = [newSession, ...sessions]
    setSessions(updatedSessions)
    saveSessions(updatedSessions)

    // Save to Supabase if authenticated
    if (user && !isGuest) {
      await saveSessionToSupabase(sessionData)
    }

    // Update daily stats
    const sessionDate = sessionData.date.split('T')[0]
    const existingStatIndex = stats.findIndex((s) => s.date.startsWith(sessionDate))

    let updatedStats: DailyStats[]
    if (existingStatIndex >= 0) {
      updatedStats = [...stats]
      updatedStats[existingStatIndex] = {
        ...updatedStats[existingStatIndex],
        total_count: updatedStats[existingStatIndex].total_count + sessionData.count,
      }
    } else {
      const newStat: DailyStats = {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
        total_count: sessionData.count,
        date: sessionData.date,
        created_at: new Date().toISOString(),
      }
      updatedStats = [newStat, ...stats]
    }

    setStats(updatedStats)
    saveStats(updatedStats)

    // Save to Supabase if authenticated
    if (user && !isGuest) {
      await upsertDailyStatToSupabase(
        {
          total_count: sessionData.count,
          date: sessionData.date,
        },
        user.id
      )
    }
  }

  const toggleSound = () => setSoundEnabled((prev) => !prev)
  const toggleHaptics = () => setHapticsEnabled((prev) => !prev)

  return (
    <TasbeehContext.Provider
      value={{
        counters,
        activeCounter,
        currentCount,
        currentGoal,
        sessions,
        stats,
        soundEnabled,
        hapticsEnabled,
        syncing,
        deleteSession,
        setActiveCounter,
        incrementCount,
        resetCount,
        setGoal,
        addCounter,
        updateCounter,
        deleteCounter,
        toggleSound,
        toggleHaptics,
        completeSession,
        saveSessionManually,
      }}
    >
      {children}
    </TasbeehContext.Provider>
  )
}

export const useTasbeeh = () => {
  const context = useContext(TasbeehContext)
  if (context === undefined) {
    throw new Error('useTasbeeh must be used within a TasbeehProvider')
  }
  return context
}
