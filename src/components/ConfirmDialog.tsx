import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Trash2, RotateCcw, CheckCircle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'success'
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
}) => {
  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <Trash2 className="text-red-500" size={48} />
      case 'warning':
        return <AlertTriangle className="text-islamic-gold-500" size={48} />
      case 'success':
        return <CheckCircle className="text-islamic-green-500" size={48} />
    }
  }

  const getButtonStyle = () => {
    switch (type) {
      case 'danger':
        return 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
      case 'warning':
        return 'bg-gradient-to-r from-islamic-gold-500 to-islamic-gold-600 hover:from-islamic-gold-600 hover:to-islamic-gold-700'
      case 'success':
        return 'bg-gradient-to-r from-islamic-green-500 to-islamic-green-600 hover:from-islamic-green-600 hover:to-islamic-green-700'
    }
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="islamic-card p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Icon */}
              <div className="flex justify-center mb-4">
                {getIcon()}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-display font-bold text-islamic-green-800 mb-3">
                {title}
              </h3>

              {/* Message */}
              <p className="text-islamic-green-600 mb-6">
                {message}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl bg-islamic-ivory-200 text-islamic-green-800 font-semibold hover:bg-islamic-ivory-300 transition-colors"
                >
                  {cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  className={`flex-1 px-6 py-3 rounded-xl text-white font-semibold shadow-lg transition-all active:scale-95 ${getButtonStyle()}`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
