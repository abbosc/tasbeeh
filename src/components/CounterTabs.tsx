import React from 'react'
import { motion } from 'framer-motion'
import { useTasbeeh } from '../context/TasbeehContext'
import { Leaf, Heart, Star, Sparkles } from 'lucide-react'

const iconMap: Record<string, React.ReactNode> = {
  leaf: <Leaf size={20} />,
  heart: <Heart size={20} />,
  star: <Star size={20} />,
  sparkles: <Sparkles size={20} />,
}

const colorMap: Record<string, string> = {
  green: 'from-islamic-green-500 to-islamic-green-600',
  teal: 'from-islamic-teal-500 to-islamic-teal-600',
  gold: 'from-islamic-gold-500 to-islamic-gold-600',
}

export const CounterTabs: React.FC = () => {
  const { counters, activeCounter, setActiveCounter } = useTasbeeh()

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-thin">
      {counters.map((counter) => {
        const isActive = activeCounter?.id === counter.id

        return (
          <motion.button
            key={counter.id}
            onClick={() => setActiveCounter(counter)}
            className={`
              relative flex items-center gap-2 px-4 py-3 rounded-xl
              font-semibold text-sm whitespace-nowrap
              transition-all duration-300
              ${
                isActive
                  ? `bg-gradient-to-r ${colorMap[counter.color] || colorMap.green} text-white shadow-lg scale-105`
                  : 'bg-white/60 text-islamic-green-800 hover:bg-white/80'
              }
            `}
            whileTap={{ scale: 0.95 }}
          >
            {iconMap[counter.icon]}
            <span className="font-arabic">{counter.name}</span>

            {isActive && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-to-r from-islamic-green-500 to-islamic-teal-500 rounded-xl -z-10"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}
