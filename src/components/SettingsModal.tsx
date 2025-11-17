import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Trash2, Edit2, Leaf, Heart, Star, Sparkles, LogOut, User, Volume2 } from 'lucide-react'
import { useTasbeeh } from '../context/TasbeehContext'
import { useAuth } from '../context/AuthContext'
import { soundManager, ClickSoundType } from '../lib/sounds'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

const ICONS = [
  { name: 'leaf', icon: Leaf },
  { name: 'heart', icon: Heart },
  { name: 'star', icon: Star },
  { name: 'sparkles', icon: Sparkles },
]

const COLORS = [
  { name: 'green', class: 'bg-islamic-green-500' },
  { name: 'teal', class: 'bg-islamic-teal-500' },
  { name: 'gold', class: 'bg-islamic-gold-500' },
]

const SOUND_OPTIONS: { value: ClickSoundType; label: string; description: string }[] = [
  { value: 'soft', label: 'Soft', description: 'Gentle and subtle' },
  { value: 'bell', label: 'Bell', description: 'Clear and bright' },
  { value: 'wood', label: 'Wood', description: 'Natural and warm' },
  { value: 'beads', label: 'Beads', description: 'Traditional tasbih' },
  { value: 'crystal', label: 'Crystal', description: 'Crystalline chime' },
]

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { counters, addCounter, deleteCounter } = useTasbeeh()
  const { user, isGuest, signOut } = useAuth()
  const [isAddingCounter, setIsAddingCounter] = useState(false)
  const [newCounterName, setNewCounterName] = useState('')
  const [selectedIcon, setSelectedIcon] = useState('leaf')
  const [selectedColor, setSelectedColor] = useState('green')
  const [selectedSound, setSelectedSound] = useState<ClickSoundType>(soundManager.getCurrentSoundType())

  useEffect(() => {
    setSelectedSound(soundManager.getCurrentSoundType())
  }, [isOpen])

  const handleSoundChange = (sound: ClickSoundType) => {
    setSelectedSound(sound)
    soundManager.setSoundType(sound)
    soundManager.playClick() // Preview the sound
  }

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      await signOut()
      onClose()
    }
  }

  const handleAddCounter = () => {
    if (newCounterName.trim()) {
      addCounter({
        name: newCounterName,
        icon: selectedIcon,
        color: selectedColor,
      })
      setNewCounterName('')
      setIsAddingCounter(false)
    }
  }

  const handleDeleteCounter = (id: string) => {
    if (counters.length > 1) {
      if (window.confirm('Are you sure you want to delete this counter?')) {
        deleteCounter(id)
      }
    } else {
      alert('You must have at least one counter')
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="islamic-card p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-islamic-green-800">
                  Settings
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Counters Management */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-islamic-green-700">
                    Your Counters
                  </h3>
                  <button
                    onClick={() => setIsAddingCounter(!isAddingCounter)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-islamic-green-100 text-islamic-green-700 hover:bg-islamic-green-200 transition-colors"
                  >
                    <Plus size={16} />
                    Add
                  </button>
                </div>

                {/* Add Counter Form */}
                {isAddingCounter && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-4 p-4 bg-islamic-ivory-50 rounded-lg border border-islamic-green-200"
                  >
                    <input
                      type="text"
                      value={newCounterName}
                      onChange={(e) => setNewCounterName(e.target.value)}
                      placeholder="Counter name (e.g., سبحان الله)"
                      className="w-full px-4 py-2 mb-3 rounded-lg border-2 border-islamic-green-200 focus:border-islamic-green-500 focus:outline-none font-arabic"
                    />

                    {/* Icon Selection */}
                    <div className="mb-3">
                      <p className="text-sm text-islamic-green-700 mb-2">Icon:</p>
                      <div className="flex gap-2">
                        {ICONS.map(({ name, icon: Icon }) => (
                          <button
                            key={name}
                            onClick={() => setSelectedIcon(name)}
                            className={`p-3 rounded-lg transition-all ${
                              selectedIcon === name
                                ? 'bg-islamic-green-500 text-white'
                                : 'bg-white text-islamic-green-600 hover:bg-islamic-green-100'
                            }`}
                          >
                            <Icon size={20} />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-3">
                      <p className="text-sm text-islamic-green-700 mb-2">Color:</p>
                      <div className="flex gap-2">
                        {COLORS.map(({ name, class: colorClass }) => (
                          <button
                            key={name}
                            onClick={() => setSelectedColor(name)}
                            className={`w-10 h-10 rounded-lg ${colorClass} ${
                              selectedColor === name
                                ? 'ring-4 ring-islamic-green-300'
                                : ''
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleAddCounter}
                        className="flex-1 islamic-button"
                        disabled={!newCounterName.trim()}
                      >
                        Add Counter
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingCounter(false)
                          setNewCounterName('')
                        }}
                        className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Counter List */}
                <div className="space-y-2">
                  {counters.map((counter) => (
                    <div
                      key={counter.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-islamic-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full bg-gradient-to-r ${
                            counter.color === 'green'
                              ? 'from-islamic-green-500 to-islamic-green-600'
                              : counter.color === 'teal'
                              ? 'from-islamic-teal-500 to-islamic-teal-600'
                              : 'from-islamic-gold-500 to-islamic-gold-600'
                          } flex items-center justify-center text-white`}
                        >
                          {ICONS.find((i) => i.name === counter.icon)?.icon && (
                            React.createElement(
                              ICONS.find((i) => i.name === counter.icon)!.icon,
                              { size: 16 }
                            )
                          )}
                        </div>
                        <p className="font-arabic text-islamic-green-800">{counter.name}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteCounter(counter.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={counters.length === 1}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sound Selection */}
              <div className="mb-6 pb-6 border-b border-islamic-green-200">
                <div className="flex items-center gap-2 mb-4">
                  <Volume2 className="text-islamic-green-600" size={20} />
                  <h3 className="text-lg font-semibold text-islamic-green-700">
                    Click Sound
                  </h3>
                </div>

                <div className="space-y-2">
                  {SOUND_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSoundChange(option.value)}
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedSound === option.value
                          ? 'border-islamic-green-500 bg-islamic-green-50 dark:bg-islamic-green-900/20'
                          : 'border-islamic-green-100 dark:border-islamic-green-800 bg-white dark:bg-gray-800 hover:border-islamic-green-300 dark:hover:border-islamic-green-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`font-semibold ${
                            selectedSound === option.value
                              ? 'text-islamic-green-800 dark:text-islamic-green-200'
                              : 'text-islamic-green-700 dark:text-islamic-green-300'
                          }`}>
                            {option.label}
                          </p>
                          <p className={`text-sm ${
                            selectedSound === option.value
                              ? 'text-islamic-green-600 dark:text-islamic-green-400'
                              : 'text-islamic-green-500 dark:text-islamic-green-500'
                          }`}>
                            {option.description}
                          </p>
                        </div>
                        {selectedSound === option.value && (
                          <div className="w-5 h-5 rounded-full bg-islamic-green-500 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account Section */}
              {(user || isGuest) && (
                <div className="mb-6 pb-6 border-b border-islamic-green-200">
                  <h3 className="text-lg font-semibold text-islamic-green-700 mb-4">
                    Account
                  </h3>

                  {user && !isGuest && (
                    <div className="space-y-3">
                      <div className="p-4 bg-islamic-green-50 rounded-lg border border-islamic-green-200">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-islamic-green-500 to-islamic-teal-500 flex items-center justify-center">
                            <User className="text-white" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-islamic-green-800">
                              {user.user_metadata?.name || 'User'}
                            </p>
                            <p className="text-sm text-islamic-green-600">{user.email}</p>
                          </div>
                        </div>
                        <p className="text-xs text-islamic-green-600 mt-2">
                          ✓ Data synced across devices
                        </p>
                      </div>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors"
                      >
                        <LogOut size={20} />
                        Sign Out
                      </button>
                    </div>
                  )}

                  {isGuest && (
                    <div className="p-4 bg-islamic-gold-50 rounded-lg border border-islamic-gold-200">
                      <p className="text-sm text-islamic-gold-800 mb-3">
                        You're using Guest Mode. Data is saved locally only.
                      </p>
                      <button
                        onClick={() => {
                          localStorage.removeItem('guest_mode')
                          window.location.reload()
                        }}
                        className="w-full islamic-button"
                      >
                        Sign In to Sync Data
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* About */}
              <div className="pt-4 border-t border-islamic-green-200">
                <p className="text-sm text-islamic-green-600 text-center">
                  Tasbeeh - Digital Dhikr Counter
                </p>
                <p className="text-xs text-islamic-green-500 text-center mt-1">
                  Made with ♥ for the Ummah
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
