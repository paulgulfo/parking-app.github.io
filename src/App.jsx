import React, { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from './firebaseConfig'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

// Firebase config is loaded from `src/firebaseConfig.js` (replace placeholders there)

export default function App() {
  const [user, setUser] = useState(null)
  

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u))
  }, [auth])

  if (!user) return <Login />

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Parking App</h1>
          <div>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded"
              onClick={() => signOut(auth)}
            >
              Sign out
            </button>
          </div>
        </div>
        <Dashboard user={user} db={db} />
      </div>
    </div>
  )
}
