import React from 'react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'

export default function LandingPage() {
  const [showAuth, setShowAuth] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [isRegister, setIsRegister] = React.useState(false)
  const [error, setError] = React.useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password)
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  if (!showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <div className="mb-8">
            <div className="text-6xl mb-4">🅿️</div>
            <h1 className="text-4xl font-bold mb-2">Parking App</h1>
            <p className="text-xl text-teal-100">Smart Parking Management System</p>
          </div>

          <div className="space-y-4 mt-12">
            <p className="text-teal-100 mb-8">Manage parking slots efficiently with real-time availability</p>
            <button
              onClick={() => setShowAuth(true)}
              className="w-full px-6 py-3 bg-white text-teal-600 font-bold rounded-lg hover:bg-gray-100 transition"
            >
              Get Started
            </button>
          </div>

          <div className="mt-16 pt-8 border-t border-teal-400 space-y-2 text-sm text-teal-100">
            <p>🛡️ Guard & Admin Roles</p>
            <p>📊 Real-time Slot Management</p>
            <p>📱 QR Code Reservations</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">
            {isRegister ? 'Create Account' : 'Login'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="w-full px-4 py-2 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition"
            >
              {isRegister ? 'Register' : 'Login'}
            </button>
          </form>

          <div className="mt-6 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setShowAuth(false)
                setError('')
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setError('')
              }}
              className="flex-1 px-4 py-2 text-teal-600 font-semibold hover:bg-teal-50 rounded-lg transition"
            >
              {isRegister ? 'Have account?' : 'No account?'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
