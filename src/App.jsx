import React, { useState, useEffect } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from './firebaseConfig'
import { doc, getDoc } from 'firebase/firestore'
import LandingPage from './components/LandingPage'
import RoleSelector from './components/RoleSelector'
import UserDashboard from './components/UserDashboard'
import GuardDashboard from './components/GuardDashboard'
import AdminDashboard from './components/AdminDashboard'

export default function App() {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', u.uid))
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role)
          }
        } catch (err) {
          console.error('Error fetching user role:', err)
        }
      } else {
        setUserRole(null)
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🅿️</div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Not logged in - show landing page
  if (!user) {
    return <LandingPage />
  }

  // Logged in but no role selected - show role selector
  if (!userRole) {
    return <RoleSelector user={user} />
  }

  // Logged in with role - show appropriate dashboard
  const getRoleDisplay = () => {
    switch (userRole) {
      case 'user':
        return { icon: '👤', label: 'USER' }
      case 'guard':
        return { icon: '👮', label: 'GUARD' }
      case 'admin':
        return { icon: '⚙️', label: 'ADMIN' }
      default:
        return { icon: '👤', label: 'USER' }
    }
  }

  const roleDisplay = getRoleDisplay()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded shadow">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">
              {roleDisplay.icon} Parking App
            </h1>
            <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold">
              {roleDisplay.label}
            </span>
          </div>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={() => signOut(auth)}
          >
            Sign out
          </button>
        </div>

        {userRole === 'admin' ? (
          <AdminDashboard user={user} db={db} />
        ) : userRole === 'guard' ? (
          <GuardDashboard user={user} db={db} />
        ) : (
          <UserDashboard user={user} db={db} />
        )}
      </div>
    </div>
  )
}
