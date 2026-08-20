import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebaseConfig'

export default function RoleSelector({ user }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectRole = async (role) => {
    setLoading(true)
    setError('')
    try {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: role,
        createdAt: new Date(),
      })
      window.location.reload()
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to Parking App</h1>
          <p className="text-gray-300">Select your role to get started</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500 text-white rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Role */}
          <button
            onClick={() => selectRole('user')}
            disabled={loading}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-green-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative px-7 py-10 bg-gray-800 rounded-lg">
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-2xl font-bold text-white mb-4">User</h2>
              <ul className="text-gray-300 text-sm space-y-2 mb-6">
                <li>✓ View parking slots</li>
                <li>✓ Check availability</li>
                <li>✓ Make reservations</li>
                <li>✓ Track bookings</li>
              </ul>
              <span className="inline-block px-4 py-2 bg-green-600 text-white rounded font-semibold">
                {loading ? 'Loading...' : 'Continue as User'}
              </span>
            </div>
          </button>

          {/* Guard Role */}
          <button
            onClick={() => selectRole('guard')}
            disabled={loading}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative px-7 py-10 bg-gray-800 rounded-lg">
              <div className="text-5xl mb-4">👮</div>
              <h2 className="text-2xl font-bold text-white mb-4">Guard</h2>
              <ul className="text-gray-300 text-sm space-y-2 mb-6">
                <li>✓ View parking slots</li>
                <li>✓ Reserve slots</li>
                <li>✓ Process checkouts</li>
                <li>✓ Generate QR codes</li>
              </ul>
              <span className="inline-block px-4 py-2 bg-blue-600 text-white rounded font-semibold">
                {loading ? 'Loading...' : 'Continue as Guard'}
              </span>
            </div>
          </button>

          {/* Admin Role */}
          <button
            onClick={() => selectRole('admin')}
            disabled={loading}
            className="relative group cursor-pointer"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative px-7 py-10 bg-gray-800 rounded-lg">
              <div className="text-5xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold text-white mb-4">Admin</h2>
              <ul className="text-gray-300 text-sm space-y-2 mb-6">
                <li>✓ Manage all slots</li>
                <li>✓ View analytics</li>
                <li>✓ Manage reservations</li>
                <li>✓ Generate reports</li>
              </ul>
              <span className="inline-block px-4 py-2 bg-purple-600 text-white rounded font-semibold">
                {loading ? 'Loading...' : 'Continue as Admin'}
              </span>
            </div>
          </button>
        </div>

        <p className="text-center text-gray-400 text-sm mt-8">
          You are logged in as: <span className="font-semibold text-gray-200">{user.email}</span>
        </p>
      </div>
    </div>
  )
}
