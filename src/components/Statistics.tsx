import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Calendar, TrendingUp, Award, Trash2, Plus } from 'lucide-react'
import { useTasbeeh } from '../context/TasbeehContext'
import { ConfirmDialog } from './ConfirmDialog'
import { AddSessionModal } from './AddSessionModal'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export const Statistics: React.FC = () => {
  const { sessions, counters, deleteSession } = useTasbeeh()
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null)
  const [isAddSessionModalOpen, setIsAddSessionModalOpen] = useState(false)

  const handleDeleteSession = () => {
    if (deleteSessionId) {
      deleteSession(deleteSessionId)
      setDeleteSessionId(null)
    }
  }

  // Calculate stats directly from sessions
  const getSessionsByDate = (dateStr: string) => {
    return sessions.filter((s) => s.date.startsWith(dateStr))
  }

  const getCountForDate = (dateStr: string) => {
    return getSessionsByDate(dateStr).reduce((sum, s) => sum + s.count, 0)
  }

  // Get last 7 days of stats
  const last7Days = [...Array(7)].map((_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i)
    return date.toISOString().split('T')[0]
  }).reverse()

  const chartData = last7Days.map((date) => {
    return {
      date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      count: getCountForDate(date),
    }
  })

  // Calculate totals from sessions
  const totalCount = sessions.reduce((sum, session) => sum + session.count, 0)
  const todayCount = getCountForDate(new Date().toISOString().split('T')[0])

  // Calculate unique days that have sessions
  const uniqueDays = new Set(sessions.map((s) => s.date.split('T')[0])).size

  // Recent sessions
  const recentSessions = sessions.slice(0, 5)

  const getCounterName = (counterId: string) => {
    return counters.find((c) => c.id === counterId)?.name || 'Unknown'
  }

  return (
    <div className="space-y-6">
      {/* Add Session Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => setIsAddSessionModalOpen(true)}
        className="w-full islamic-button flex items-center justify-center gap-2"
      >
        <Plus size={20} />
        Add Session Manually
      </motion.button>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="islamic-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="text-islamic-green-600" size={20} />
            <p className="text-xs text-islamic-green-700 font-semibold">Total</p>
          </div>
          <p className="text-2xl font-bold text-islamic-green-800">{totalCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="islamic-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="text-islamic-teal-600" size={20} />
            <p className="text-xs text-islamic-teal-700 font-semibold">Today</p>
          </div>
          <p className="text-2xl font-bold text-islamic-teal-800">{todayCount}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="islamic-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Award className="text-islamic-gold-600" size={20} />
            <p className="text-xs text-islamic-gold-700 font-semibold">Sessions</p>
          </div>
          <p className="text-2xl font-bold text-islamic-gold-800">{sessions.length}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="islamic-card p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="text-islamic-green-600" size={20} />
            <p className="text-xs text-islamic-green-700 font-semibold">Avg/Day</p>
          </div>
          <p className="text-2xl font-bold text-islamic-green-800">
            {uniqueDays > 0 ? Math.round(totalCount / uniqueDays) : 0}
          </p>
        </motion.div>
      </div>

      {/* Chart */}
      {chartData.some((d) => d.count > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="islamic-card p-6"
        >
          <h3 className="text-lg font-display font-bold text-islamic-green-800 mb-4">
            Last 7 Days
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '2px solid #fde68a',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="count" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="islamic-card p-6"
        >
          <h3 className="text-lg font-display font-bold text-islamic-green-800 mb-4">
            Recent Sessions
          </h3>
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-islamic-ivory-50 dark:bg-gray-700/30 rounded-lg group"
              >
                <div>
                  <p className="font-arabic text-sm text-islamic-green-800 dark:text-islamic-green-200">
                    {getCounterName(session.counter_id)}
                  </p>
                  <p className="text-xs text-islamic-green-600 dark:text-islamic-green-400">
                    {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-islamic-green-800 dark:text-islamic-green-200">
                      {session.count}
                    </p>
                    {session.goal && (
                      <p className="text-xs text-islamic-green-600 dark:text-islamic-green-400">
                        Goal: {session.goal}
                        {session.completed && ' ✓'}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setDeleteSessionId(session.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-600 dark:text-red-400"
                    title="Delete session"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {sessions.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-islamic-green-600 dark:text-islamic-green-400">
            No sessions yet. Start counting to see your statistics!
          </p>
        </motion.div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteSessionId !== null}
        onClose={() => setDeleteSessionId(null)}
        onConfirm={handleDeleteSession}
        title="Delete Session?"
        message="This will permanently delete this counting session. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Add Session Modal */}
      <AddSessionModal
        isOpen={isAddSessionModalOpen}
        onClose={() => setIsAddSessionModalOpen(false)}
      />
    </div>
  )
}
