import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { TasbeehProvider } from './context/TasbeehContext'
import { Auth } from './components/Auth'
import { Header } from './components/Header'
import { CounterTabs } from './components/CounterTabs'
import { Counter } from './components/Counter'
import { ActionButtons } from './components/ActionButtons'
import { GoalModal } from './components/GoalModal'
import { Statistics } from './components/Statistics'
import { SettingsModal } from './components/SettingsModal'
import { FocusMode } from './components/FocusMode'
import { BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { getDarkMode, saveDarkMode } from './lib/localStorage'

function MainApp() {
  const { user, isGuest, loading } = useAuth()
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = getDarkMode()
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    saveDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-green-500 to-islamic-teal-500 flex items-center justify-center animate-pulse">
            <span className="text-4xl">📿</span>
          </div>
          <p className="text-islamic-green-700 dark:text-islamic-green-300 font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  // Show auth screen if not logged in and not guest
  if (!user && !isGuest) {
    return <Auth />
  }

  return (
    <TasbeehProvider>
      <div className="min-h-screen pb-8">
        {/* Decorative Background Pattern */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10 dark:opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-islamic-green-300 dark:bg-islamic-green-600 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-islamic-teal-300 dark:bg-islamic-teal-600 rounded-full blur-3xl" />
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 pt-6">
          <Header
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
          />

          {/* Guest Mode Banner */}
          {isGuest && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-islamic-gold-50 dark:bg-islamic-gold-900/20 border border-islamic-gold-200 dark:border-islamic-gold-700 rounded-lg text-center"
            >
              <p className="text-sm text-islamic-gold-800 dark:text-islamic-gold-300">
                You're in Guest Mode. Data is saved locally.{' '}
                <button
                  onClick={() => {
                    localStorage.removeItem('guest_mode')
                    window.location.reload()
                  }}
                  className="underline font-semibold hover:text-islamic-gold-900 dark:hover:text-islamic-gold-200"
                >
                  Sign in to sync across devices
                </button>
              </p>
            </motion.div>
          )}

          {/* View Toggle */}
          <div className="flex justify-center mb-6">
            <div className="islamic-card p-1 flex gap-1">
              <button
                onClick={() => setShowStats(false)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                  !showStats
                    ? 'bg-gradient-to-r from-islamic-green-500 to-islamic-teal-500 text-white'
                    : 'text-islamic-green-700 dark:text-islamic-green-300 hover:bg-islamic-green-50 dark:hover:bg-islamic-green-900/20'
                }`}
              >
                Counter
              </button>
              <button
                onClick={() => setShowStats(true)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  showStats
                    ? 'bg-gradient-to-r from-islamic-green-500 to-islamic-teal-500 text-white'
                    : 'text-islamic-green-700 dark:text-islamic-green-300 hover:bg-islamic-green-50 dark:hover:bg-islamic-green-900/20'
                }`}
              >
                <BarChart3 size={18} />
                Statistics
              </button>
            </div>
          </div>

          {/* Counter View */}
          {!showStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Counter Tabs */}
              <CounterTabs />

              {/* Main Counter Card */}
              <div className="islamic-card p-8 md:p-12">
                <Counter />
              </div>

              {/* Action Buttons */}
              <ActionButtons
                onOpenGoalModal={() => setIsGoalModalOpen(true)}
                onOpenFocusMode={() => setIsFocusModeOpen(true)}
              />
            </motion.div>
          )}

          {/* Statistics View */}
          {showStats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Statistics />
            </motion.div>
          )}

          {/* Modals */}
          <GoalModal
            isOpen={isGoalModalOpen}
            onClose={() => setIsGoalModalOpen(false)}
          />
          <SettingsModal
            isOpen={isSettingsModalOpen}
            onClose={() => setIsSettingsModalOpen(false)}
          />
          <FocusMode
            isOpen={isFocusModeOpen}
            onClose={() => setIsFocusModeOpen(false)}
          />
        </div>
      </div>
    </TasbeehProvider>
  )
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  )
}

export default App
