import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, Target, Check, Maximize, Moon } from 'lucide-react'
import { useTasbeeh } from '../context/TasbeehContext'
import { ConfirmDialog } from './ConfirmDialog'

interface ActionButtonsProps {
  onOpenGoalModal: () => void
  onOpenFocusMode: () => void
  onOpenBatmanMode: () => void
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ onOpenGoalModal, onOpenFocusMode, onOpenBatmanMode }) => {
  const { currentCount, resetCount, completeSession, currentGoal } = useTasbeeh()
  const [showResetDialog, setShowResetDialog] = useState(false)

  const handleReset = () => {
    resetCount()
  }

  const handleComplete = () => {
    if (currentCount > 0) {
      completeSession()
    }
  }

  return (
    <>
      <div className="flex gap-3 justify-center flex-wrap">
        {/* Focus Mode Button */}
        <motion.button
          onClick={onOpenFocusMode}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-islamic-teal-100 text-islamic-teal-700 font-semibold hover:bg-islamic-teal-200 transition-colors dark:bg-islamic-teal-900/30 dark:text-islamic-teal-400 dark:hover:bg-islamic-teal-900/50"
          whileTap={{ scale: 0.95 }}
        >
          <Maximize size={20} />
          Focus Mode
        </motion.button>

        {/* Batman Mode Button */}
        <motion.button
          onClick={onOpenBatmanMode}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-black transition-colors dark:bg-gray-800 dark:hover:bg-gray-900"
          whileTap={{ scale: 0.95 }}
        >
          <Moon size={20} />
          Batman Mode
        </motion.button>

        {/* Set Goal Button */}
        <motion.button
          onClick={onOpenGoalModal}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-islamic-gold-100 text-islamic-gold-700 font-semibold hover:bg-islamic-gold-200 transition-colors dark:bg-islamic-gold-900/30 dark:text-islamic-gold-400 dark:hover:bg-islamic-gold-900/50"
          whileTap={{ scale: 0.95 }}
        >
          <Target size={20} />
          {currentGoal ? 'Change Goal' : 'Set Goal'}
        </motion.button>

        {/* Complete Session Button */}
        {currentCount > 0 && (
          <motion.button
            onClick={handleComplete}
            className="flex items-center gap-2 islamic-button"
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Check size={20} />
            Complete
          </motion.button>
        )}

        {/* Reset Button */}
        {currentCount > 0 && (
          <motion.button
            onClick={() => setShowResetDialog(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <RotateCcw size={20} />
            Reset
          </motion.button>
        )}
      </div>

      {/* Reset Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleReset}
        title="Reset Counter?"
        message="This will reset your current count to zero. This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        type="warning"
      />
    </>
  )
}
