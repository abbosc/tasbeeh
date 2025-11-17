import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus } from 'lucide-react'
import { useTasbeeh } from '../context/TasbeehContext'
import { Session } from '../lib/supabase'

interface AddSessionModalProps {
  isOpen: boolean
  onClose: () => void
}

export const AddSessionModal: React.FC<AddSessionModalProps> = ({ isOpen, onClose }) => {
  const { counters, sessions, stats, saveSessionManually } = useTasbeeh()
  const [selectedCounterId, setSelectedCounterId] = useState(counters[0]?.id || '')
  const [count, setCount] = useState('')
  const [goal, setGoal] = useState('')
  const [completed, setCompleted] = useState(false)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!count || parseInt(count) <= 0) {
      alert('Please enter a valid count')
      return
    }

    const countValue = parseInt(count)
    const goalValue = goal ? parseInt(goal) : null

    const newSession: Omit<Session, 'id' | 'created_at'> = {
      counter_id: selectedCounterId,
      count: countValue,
      goal: goalValue,
      completed: goalValue ? countValue >= goalValue : completed,
      date: new Date(date).toISOString(),
    }

    saveSessionManually(newSession)

    // Reset form
    setCount('')
    setGoal('')
    setCompleted(false)
    setDate(new Date().toISOString().split('T')[0])
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="islamic-card p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-display font-bold text-islamic-green-800 dark:text-islamic-green-200">
                Add Session
              </h2>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-islamic-green-50 dark:hover:bg-islamic-green-900/20 transition-colors text-islamic-green-700 dark:text-islamic-green-300"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Counter Selection */}
              <div>
                <label className="block text-sm font-semibold text-islamic-green-700 dark:text-islamic-green-300 mb-2">
                  Counter
                </label>
                <select
                  value={selectedCounterId}
                  onChange={(e) => setSelectedCounterId(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-islamic-gold-200 dark:border-islamic-gold-700 bg-white dark:bg-gray-800 text-islamic-green-800 dark:text-islamic-green-200 focus:outline-none focus:border-islamic-green-500"
                >
                  {counters.map((counter) => (
                    <option key={counter.id} value={counter.id}>
                      {counter.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Count Input */}
              <div>
                <label className="block text-sm font-semibold text-islamic-green-700 dark:text-islamic-green-300 mb-2">
                  Count *
                </label>
                <input
                  type="number"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  min="1"
                  placeholder="Enter count..."
                  className="w-full px-4 py-2 rounded-lg border-2 border-islamic-gold-200 dark:border-islamic-gold-700 bg-white dark:bg-gray-800 text-islamic-green-800 dark:text-islamic-green-200 focus:outline-none focus:border-islamic-green-500"
                  required
                />
              </div>

              {/* Goal Input */}
              <div>
                <label className="block text-sm font-semibold text-islamic-green-700 dark:text-islamic-green-300 mb-2">
                  Goal (optional)
                </label>
                <input
                  type="number"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  min="1"
                  placeholder="Enter goal..."
                  className="w-full px-4 py-2 rounded-lg border-2 border-islamic-gold-200 dark:border-islamic-gold-700 bg-white dark:bg-gray-800 text-islamic-green-800 dark:text-islamic-green-200 focus:outline-none focus:border-islamic-green-500"
                />
              </div>

              {/* Date Input */}
              <div>
                <label className="block text-sm font-semibold text-islamic-green-700 dark:text-islamic-green-300 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-islamic-gold-200 dark:border-islamic-gold-700 bg-white dark:bg-gray-800 text-islamic-green-800 dark:text-islamic-green-200 focus:outline-none focus:border-islamic-green-500"
                  required
                />
              </div>

              {/* Completed Checkbox (only if no goal) */}
              {!goal && (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="completed"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="w-4 h-4 rounded border-islamic-gold-300 text-islamic-green-600 focus:ring-islamic-green-500"
                  />
                  <label htmlFor="completed" className="text-sm text-islamic-green-700 dark:text-islamic-green-300">
                    Mark as completed
                  </label>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-islamic-green-600 to-islamic-teal-600 text-white hover:from-islamic-green-700 hover:to-islamic-teal-700 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={20} />
                  Add Session
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
