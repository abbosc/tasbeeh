import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Target } from 'lucide-react'
import { useTasbeeh } from '../context/TasbeehContext'
import { soundManager, haptics } from '../lib/sounds'

interface FocusModeProps {
  isOpen: boolean
  onClose: () => void
}

export const FocusMode: React.FC<FocusModeProps> = ({ isOpen, onClose }) => {
  const {
    activeCounter,
    currentCount,
    currentGoal,
    incrementCount,
    soundEnabled,
    hapticsEnabled,
  } = useTasbeeh()

  const handleIncrement = () => {
    incrementCount()

    if (soundEnabled) {
      soundManager.playClick()

      if ([33, 66, 99].includes(currentCount + 1)) {
        setTimeout(() => soundManager.playMilestone(), 100)
      }

      if (currentGoal && currentCount + 1 === currentGoal) {
        setTimeout(() => soundManager.playSuccess(), 100)
      }
    }

    if (hapticsEnabled) {
      haptics.click()

      if ([33, 66, 99].includes(currentCount + 1)) {
        setTimeout(() => haptics.milestone(), 100)
      }

      if (currentGoal && currentCount + 1 === currentGoal) {
        setTimeout(() => haptics.success(), 100)
      }
    }
  }

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        handleIncrement()
      } else if (e.code === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isOpen, currentCount, currentGoal, soundEnabled, hapticsEnabled])

  const progress = currentGoal ? (currentCount / currentGoal) * 100 : 0
  const isGoalReached = currentGoal ? currentCount >= currentGoal : false

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-gradient-to-br from-islamic-green-900 via-islamic-teal-900 to-islamic-green-900"
        >
          {/* Decorative Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-islamic-gold-300 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-islamic-teal-300 rounded-full blur-3xl animate-pulse" />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors z-50"
            title="Close Focus Mode"
          >
            <X size={24} />
          </button>

          {/* Main Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
            {/* Counter Name */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <h2 className="text-4xl md:text-5xl font-arabic text-white mb-2 text-shadow-gold">
                {activeCounter?.name}
              </h2>
              {currentGoal && (
                <div className="flex items-center justify-center gap-2 text-white/80">
                  <Target size={20} />
                  <span className="text-lg">Goal: {currentGoal}</span>
                </div>
              )}
            </motion.div>

            {/* Counter Display */}
            <div className="relative mb-12">
              {currentGoal ? (
                // With Progress Ring
                <div className="relative w-80 h-80 md:w-96 md:h-96">
                  <svg className="w-full h-full -rotate-90">
                    {/* Background circle */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="12"
                    />
                    {/* Progress circle */}
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      fill="none"
                      stroke="url(#focusGradient)"
                      strokeWidth="12"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                      className="progress-ring"
                    />
                    <defs>
                      <linearGradient id="focusGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Counter in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      onClick={handleIncrement}
                      className={`w-64 h-64 md:w-72 md:h-72 rounded-full bg-gradient-to-br ${
                        isGoalReached
                          ? 'from-islamic-gold-400 via-islamic-gold-500 to-islamic-gold-600'
                          : 'from-white/20 via-white/10 to-white/5'
                      } backdrop-blur-md border-4 ${
                        isGoalReached ? 'border-islamic-gold-300' : 'border-white/30'
                      } shadow-2xl hover:scale-105 transition-transform active:scale-95 cursor-pointer`}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.span
                        key={currentCount}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-8xl md:text-9xl font-bold text-white text-shadow-gold"
                      >
                        {currentCount}
                      </motion.span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                // Without Progress Ring
                <motion.button
                  onClick={handleIncrement}
                  className="w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-md border-4 border-white/30 shadow-2xl hover:scale-105 transition-transform cursor-pointer"
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    key={currentCount}
                    initial={{ scale: 1.3, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-9xl md:text-[12rem] font-bold text-white text-shadow-gold"
                  >
                    {currentCount}
                  </motion.span>
                </motion.button>
              )}
            </div>

            {/* Goal Achievement */}
            {isGoalReached && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <p className="text-4xl md:text-5xl font-arabic text-islamic-gold-300 mb-2">
                  ماشاء الله
                </p>
                <p className="text-2xl text-white/90">Goal Achieved!</p>
              </motion.div>
            )}

            {/* Instructions */}
            {currentCount === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center text-white/60 mt-8"
              >
                <p className="text-lg mb-2">Tap or press Space to count</p>
                <p className="text-sm">Press Esc to exit</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
