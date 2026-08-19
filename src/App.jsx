import React, { useState, useEffect } from 'react'
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

// TODO: replace with your Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
}

initializeApp(firebaseConfig)
const db = getFirestore()

export default function App() {
  const [user, setUser] = useState(null)
  const auth = getAuth()

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
