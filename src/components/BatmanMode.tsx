import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTasbeeh } from '../context/TasbeehContext'

interface BatmanModeProps {
  isOpen: boolean
  onClose: () => void
}

interface LightAnimation {
  id: number
  y: number
}

export const BatmanMode: React.FC<BatmanModeProps> = ({ isOpen, onClose }) => {
  const { currentCount, incrementCount } = useTasbeeh()
  const [lights, setLights] = useState<LightAnimation[]>([])
  const [_lightIdCounter, setLightIdCounter] = useState(0)
  const [showExitHint, setShowExitHint] = useState(true)

  // Refs to avoid closure issues in keyboard handler
  const incrementCountRef = useRef(incrementCount)
  const triggerAnimationRef = useRef<(yPosition?: number) => void>(() => {})

  // Update refs when functions change
  useEffect(() => {
    incrementCountRef.current = incrementCount
  }, [incrementCount])

  // Hide exit hint after 3 seconds
  useEffect(() => {
    if (isOpen) {
      setShowExitHint(true)
      const timer = setTimeout(() => {
        setShowExitHint(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Fullscreen API
  useEffect(() => {
    if (isOpen) {
      const elem = document.documentElement
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch(() => {
          // Fullscreen may be denied, that's okay
        })
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {
          // Exit may fail, that's okay
        })
      }
    }
  }, [isOpen])

  // Trigger light animation
  const triggerAnimation = useCallback((yPosition?: number) => {
    const y = yPosition ?? Math.random() * 80 + 10

    setLightIdCounter(prevId => {
      const newId = prevId + 1
      const newLight: LightAnimation = {
        id: newId,
        y,
      }

      setLights(prev => [...prev, newLight])

      // Remove light after animation completes
      setTimeout(() => {
        setLights(prev => prev.filter(light => light.id !== newId))
      }, 1000)

      return newId
    })
  }, [])

  // Update ref whenever triggerAnimation changes
  useEffect(() => {
    triggerAnimationRef.current = triggerAnimation
  }, [triggerAnimation])

  // Handle count increment from click/touch
  const handleIncrement = useCallback((event?: React.MouseEvent | React.TouchEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    incrementCount()

    // Get Y position from event or random
    let yPosition = Math.random() * 80 + 10

    if (event && 'clientY' in event) {
      yPosition = (event.clientY / window.innerHeight) * 100
    } else if (event && 'touches' in event && event.touches.length > 0) {
      yPosition = (event.touches[0].clientY / window.innerHeight) * 100
    }

    triggerAnimation(yPosition)
  }, [incrementCount, triggerAnimation])

  // Handle keyboard events
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        // Use refs to avoid closure issues
        incrementCountRef.current()
        triggerAnimationRef.current()
      } else if (e.code === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] bg-black cursor-pointer select-none overflow-hidden"
      onClick={handleIncrement}
      onTouchStart={handleIncrement}
    >
      {/* Light animations */}
      <AnimatePresence>
        {lights.map(light => (
          <motion.div
            key={light.id}
            initial={{ x: 0, opacity: 1 }}
            animate={{
              x: window.innerWidth,
              opacity: 1,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.0,
              ease: 'linear',
            }}
            className="absolute pointer-events-none"
            style={{
              top: `${light.y}%`,
              left: 0,
              width: '100px',
              height: '100px',
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Bright moving light with trail effect */}
            <div className="relative w-full h-full">
              {/* Main bright light */}
              <div
                className="absolute w-20 h-20 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.9) 20%, rgba(200,230,255,0.7) 40%, rgba(150,200,255,0.3) 60%, transparent 100%)',
                  boxShadow: '0 0 40px 20px rgba(255,255,255,0.8), 0 0 80px 40px rgba(200,230,255,0.4)',
                  filter: 'brightness(1.5)',
                }}
              />
              {/* Trail effect */}
              <div
                className="absolute w-32 h-16 rounded-full"
                style={{
                  background: 'linear-gradient(to right, rgba(255,255,255,0.6), rgba(200,230,255,0.3), transparent)',
                  transform: 'translateX(-50px) translateY(10px)',
                  filter: 'blur(8px)',
                }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Count display - bottom right */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        className="fixed bottom-4 right-4 text-white text-sm font-mono pointer-events-none"
      >
        {currentCount}
      </motion.div>

      {/* Exit hint - top center */}
      <AnimatePresence>
        {showExitHint && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 0.5, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 text-white text-xs font-mono pointer-events-none"
          >
            Press ESC or click the X to exit
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit button - top right */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="fixed top-4 right-4 w-8 h-8 flex items-center justify-center text-white/40 hover:text-white/80 transition-colors pointer-events-auto z-10"
        aria-label="Exit Batman Mode"
      >
        <X size={20} />
      </button>

      {/* Instruction overlay - center (appears briefly) */}
      <AnimatePresence>
        {showExitHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.3, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center pointer-events-none"
          >
            <p className="text-2xl font-light mb-2">Click or press Space</p>
            <p className="text-sm opacity-70">to count</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
