import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Target } from 'lucide-react'
import { useTasbeeh } from '../context/TasbeehContext'

interface GoalModalProps {
  isOpen: boolean
  onClose: () => void
}

const PRESET_GOALS = [33, 66, 99, 100, 500, 1000]

export const GoalModal: React.FC<GoalModalProps> = ({ isOpen, onClose }) => {
  const { currentGoal, setGoal } = useTasbeeh()
  const [customGoal, setCustomGoal] = useState('')

  const handleSetGoal = (goal: number) => {
    setGoal(goal)
    onClose()
  }

  const handleCustomGoal = () => {
    const goal = parseInt(customGoal)
    if (!isNaN(goal) && goal > 0) {
      handleSetGoal(goal)
      setCustomGoal('')
    }
  }

  const handleRemoveGoal = () => {
    setGoal(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
          >
            <div className="islamic-card p-6 max-w-md w-full">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Target className="text-islamic-green-600" size={24} />
                  <h2 className="text-2xl font-display font-bold text-islamic-green-800">
                    Set Goal
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Current Goal */}
              {currentGoal && (
                <div className="mb-4 p-3 bg-islamic-green-50 rounded-lg border border-islamic-green-200">
                  <p className="text-sm text-islamic-green-700">
                    Current goal: <span className="font-bold">{currentGoal}</span>
                  </p>
                </div>
              )}

              {/* Preset Goals */}
              <div className="mb-6">
                <p className="text-sm text-islamic-green-700 mb-3 font-semibold">
                  Quick Select
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_GOALS.map((goal) => (
                    <motion.button
                      key={goal}
                      onClick={() => handleSetGoal(goal)}
                      className={`py-3 px-4 rounded-xl font-semibold transition-all ${
                        currentGoal === goal
                          ? 'bg-gradient-to-r from-islamic-green-500 to-islamic-teal-500 text-white'
                          : 'bg-islamic-ivory-100 text-islamic-green-800 hover:bg-islamic-ivory-200'
                      }`}
                      whileTap={{ scale: 0.95 }}
                    >
                      {goal}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Custom Goal */}
              <div className="mb-6">
                <p className="text-sm text-islamic-green-700 mb-3 font-semibold">
                  Custom Goal
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="Enter custom goal"
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-islamic-green-200 focus:border-islamic-green-500 focus:outline-none"
                    min="1"
                  />
                  <button
                    onClick={handleCustomGoal}
                    className="islamic-button"
                    disabled={!customGoal || parseInt(customGoal) <= 0}
                  >
                    Set
                  </button>
                </div>
              </div>

              {/* Remove Goal */}
              {currentGoal && (
                <button
                  onClick={handleRemoveGoal}
                  className="w-full py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                >
                  Remove Goal
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
