import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, LogIn, UserPlus, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export const Auth: React.FC = () => {
  const { signIn, signUp, continueAsGuest } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      if (isSignUp) {
        if (!name.trim()) {
          setError('Please enter your name')
          setLoading(false)
          return
        }
        const { error } = await signUp(email, password, name)
        if (error) {
          setError(error.message)
        } else {
          setMessage('Account created! Please check your email to verify your account.')
        }
      } else {
        const { error } = await signIn(email, password)
        if (error) {
          setError(error.message)
        }
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-islamic-green-300 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-islamic-teal-300 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="islamic-card p-8 max-w-md w-full relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-islamic-green-500 to-islamic-teal-500 flex items-center justify-center">
            <span className="text-4xl">📿</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-islamic-green-800 mb-2">
            Tasbeeh
          </h1>
          <p className="text-islamic-green-600 text-sm">Digital Dhikr Counter</p>
        </div>

        {/* Toggle between Sign In / Sign Up */}
        <div className="flex gap-2 mb-6 p-1 bg-islamic-ivory-100 rounded-xl">
          <button
            onClick={() => {
              setIsSignUp(false)
              setError('')
              setMessage('')
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              !isSignUp
                ? 'bg-gradient-to-r from-islamic-green-500 to-islamic-teal-500 text-white'
                : 'text-islamic-green-700'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsSignUp(true)
              setError('')
              setMessage('')
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              isSignUp
                ? 'bg-gradient-to-r from-islamic-green-500 to-islamic-teal-500 text-white'
                : 'text-islamic-green-700'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name (Sign Up only) */}
          <AnimatePresence>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-islamic-green-500" size={20} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-islamic-green-200 focus:border-islamic-green-500 focus:outline-none"
                    required={isSignUp}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-islamic-green-500" size={20} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-islamic-green-200 focus:border-islamic-green-500 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-islamic-green-500" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-islamic-green-200 focus:border-islamic-green-500 focus:outline-none"
              required
              minLength={6}
            />
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm"
            >
              {message}
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full islamic-button flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-islamic-green-200" />
          <span className="text-sm text-islamic-green-600">or</span>
          <div className="flex-1 h-px bg-islamic-green-200" />
        </div>

        {/* Continue as Guest */}
        <button
          onClick={continueAsGuest}
          className="w-full py-3 rounded-xl bg-islamic-gold-100 text-islamic-gold-700 font-semibold hover:bg-islamic-gold-200 transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles size={20} />
          Continue as Guest
        </button>

        {/* Info */}
        <p className="text-xs text-islamic-green-600 text-center mt-6">
          {isSignUp
            ? 'Create an account to sync your dhikr across devices'
            : 'Sign in to access your dhikr from any device'}
        </p>
      </motion.div>
    </div>
  )
}
