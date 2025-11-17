import React from 'react'
import { motion } from 'framer-motion'
import { Settings, Volume2, VolumeX, Smartphone, Moon, Sun } from 'lucide-react'
import { useTasbeeh } from '../context/TasbeehContext'

interface HeaderProps {
  onOpenSettings: () => void
  darkMode: boolean
  toggleDarkMode: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, darkMode, toggleDarkMode }) => {
  const { soundEnabled, hapticsEnabled, toggleSound, toggleHaptics } = useTasbeeh()

  return (
    <header className="islamic-card p-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-islamic-green-500 to-islamic-teal-500 flex items-center justify-center">
            <span className="text-2xl">📿</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-islamic-green-800 dark:text-islamic-green-200">
            Tasbeeh
          </h1>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            className={`p-2 rounded-lg transition-colors ${
              darkMode
                ? 'bg-islamic-gold-100 text-islamic-gold-700 dark:bg-islamic-gold-900/30 dark:text-islamic-gold-400'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}
            whileTap={{ scale: 0.9 }}
            title={darkMode ? 'Light Mode' : 'Dark Mode'}
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {/* Sound Toggle */}
          <motion.button
            onClick={toggleSound}
            className={`p-2 rounded-lg transition-colors ${
              soundEnabled
                ? 'bg-islamic-green-100 text-islamic-green-700 dark:bg-islamic-green-900/30 dark:text-islamic-green-400'
                : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
            }`}
            whileTap={{ scale: 0.9 }}
            title={soundEnabled ? 'Sound On' : 'Sound Off'}
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </motion.button>

          {/* Haptics Toggle */}
          <motion.button
            onClick={toggleHaptics}
            className={`p-2 rounded-lg transition-colors ${
              hapticsEnabled
                ? 'bg-islamic-teal-100 text-islamic-teal-700 dark:bg-islamic-teal-900/30 dark:text-islamic-teal-400'
                : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600'
            }`}
            whileTap={{ scale: 0.9 }}
            title={hapticsEnabled ? 'Haptics On' : 'Haptics Off'}
          >
            <Smartphone size={20} />
          </motion.button>

          {/* Settings Button */}
          <motion.button
            onClick={onOpenSettings}
            className="p-2 rounded-lg bg-islamic-gold-100 text-islamic-gold-700 hover:bg-islamic-gold-200 transition-colors dark:bg-islamic-gold-900/30 dark:text-islamic-gold-400 dark:hover:bg-islamic-gold-900/50"
            whileTap={{ scale: 0.9 }}
            title="Settings"
          >
            <Settings size={20} />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
