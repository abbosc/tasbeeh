import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTasbeeh } from '../context/TasbeehContext'
import { soundManager, haptics } from '../lib/sounds'

export const Counter: React.FC = () => {
  const {
    currentCount,
    currentGoal,
    incrementCount,
    soundEnabled,
    hapticsEnabled,
  } = useTasbeeh()

  const handleClick = () => {
    incrementCount()

    if (soundEnabled) {
      soundManager.playClick()

      // Play milestone sound at 33, 66, 99
      if ([33, 66, 99].includes(currentCount + 1)) {
        setTimeout(() => soundManager.playMilestone(), 100)
      }

      // Play success sound when goal is reached
      if (currentGoal && currentCount + 1 === currentGoal) {
        setTimeout(() => soundManager.playSuccess(), 100)
      }
    }

    if (hapticsEnabled) {
      haptics.click()

      // Stronger haptic for milestones
      if ([33, 66, 99].includes(currentCount + 1)) {
        setTimeout(() => haptics.milestone(), 100)
      }

      // Success haptic for goal completion
      if (currentGoal && currentCount + 1 === currentGoal) {
        setTimeout(() => haptics.success(), 100)
      }
    }
  }

  // Keyboard support - Space bar to increment
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault()
        handleClick()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentCount, currentGoal, soundEnabled, hapticsEnabled])

  const progress = currentGoal ? (currentCount / currentGoal) * 100 : 0
  const isGoalReached = currentGoal ? currentCount >= currentGoal : false

  return (
    <div className="flex flex-col items-center justify-center gap-8">
      {/* Progress Ring */}
      {currentGoal && (
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <svg className="w-full h-full -rotate-90">
            {/* Background circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-islamic-gold-200"
            />
            {/* Progress circle */}
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 45} ${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
              className="progress-ring"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className="text-islamic-green-500" stopColor="currentColor" />
                <stop offset="100%" className="text-islamic-teal-500" stopColor="currentColor" />
              </linearGradient>
            </defs>
          </svg>

          {/* Counter button in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              onClick={handleClick}
              className={`counter-button ${
                isGoalReached
                  ? 'from-islamic-gold-500 via-islamic-gold-600 to-islamic-gold-700 border-islamic-gold-300'
                  : ''
              }`}
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="flex flex-col items-center">
                <motion.span
                  key={currentCount}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-5xl md:text-6xl font-bold text-shadow-gold"
                >
                  {currentCount}
                </motion.span>
                {currentGoal && (
                  <span className="text-sm md:text-base opacity-90">
                    / {currentGoal}
                  </span>
                )}
              </div>
            </motion.button>
          </div>
        </div>
      )}

      {/* Simple counter button (no goal) */}
      {!currentGoal && (
        <motion.button
          onClick={handleClick}
          className="counter-button"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.span
            key={currentCount}
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl md:text-7xl font-bold text-shadow-gold"
          >
            {currentCount}
          </motion.span>
        </motion.button>
      )}

      {/* Goal completion message */}
      {isGoalReached && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-2xl md:text-3xl font-arabic text-islamic-gold-600">
            ماشاء الله
          </p>
          <p className="text-lg text-islamic-green-700 mt-2">Goal Reached!</p>
        </motion.div>
      )}

      {/* Tap instruction */}
      {currentCount === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-islamic-green-600 text-sm md:text-base text-center"
        >
          Tap or press <kbd className="px-2 py-1 bg-islamic-green-100 rounded text-xs font-semibold">Space</kbd> to count
        </motion.p>
      )}
    </div>
  )
}
