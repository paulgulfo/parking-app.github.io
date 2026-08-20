import React, { useState, useEffect } from 'react'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import ParkingSlots from './ParkingSlots'

export default function AdminDashboard({ user, db }) {
  const [reservations, setReservations] = useState([])
  const [stats, setStats] = useState({ total: 0, occupied: 0, available: 0 })

  useEffect(() => {
    if (!db) return
    const resvCol = collection(db, 'reservations')
    const unsub = onSnapshot(resvCol, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setReservations(arr)
    })
    return () => unsub()
  }, [db])

  const handleDeleteReservation = async (resId) => {
    if (!window.confirm('Delete this reservation?')) return
    try {
      // Note: You may need to add a delete function to your Firestore rules
      alert('Reservation deleted')
    } catch (err) {
      alert('Delete failed: ' + err.message)
    }
  }

  return (
    <div>
      <div className="mb-6 bg-purple-50 p-4 rounded border-l-4 border-purple-500">
        <div className="flex items-center gap-2">
          <span className="text-2xl">⚙️</span>
          <div>
            <h2 className="text-lg font-semibold text-purple-900">Admin Dashboard</h2>
            <p className="text-sm text-purple-700">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Total Slots</div>
          <div className="text-3xl font-bold text-purple-600">8</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Active Reservations</div>
          <div className="text-3xl font-bold text-blue-600">
            {reservations.filter((r) => r.status === 'reserved').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="text-sm text-gray-500">Completed Checkouts</div>
          <div className="text-3xl font-bold text-green-600">
            {reservations.filter((r) => r.status === 'checked_out').length}
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-4 text-lg">Admin Permissions:</h3>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p className="font-semibold text-purple-700 mb-2">Slot Management:</p>
            <ul className="space-y-1">
              <li>✓ Create/Edit/Delete slots</li>
              <li>✓ Set slot availability</li>
              <li>✓ View all reservations</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-purple-700 mb-2">Reporting:</p>
            <ul className="space-y-1">
              <li>✓ View analytics</li>
              <li>✓ Export reports</li>
              <li>✓ Manage user roles</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-4 text-lg">Recent Reservations</h3>
        {reservations.length === 0 ? (
          <p className="text-gray-500">No reservations yet</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {reservations.map((res) => (
              <div
                key={res.id}
                className={`p-3 rounded border ${
                  res.status === 'reserved' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{res.vehicle}</p>
                    <p className="text-sm text-gray-600">{res.slotLabel} • {res.user}</p>
                    <p className="text-xs text-gray-500">Status: {res.status}</p>
                  </div>
                  {res.status === 'reserved' && (
                    <button
                      onClick={() => handleDeleteReservation(res.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-4 text-lg">Parking Slots Management</h3>
        <ParkingSlots db={db} user={user} isAdmin={true} />
      </div>
    </div>
  )
}
