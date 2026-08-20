import React, { useState, useEffect } from 'react'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import ParkingSlots from './ParkingSlots'

export default function UserDashboard({ user, db }) {
  const [myReservations, setMyReservations] = useState([])

  useEffect(() => {
    if (!db || !user) return
    const q = query(
      collection(db, 'reservations'),
      where('user', '==', user.email)
    )
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
      setMyReservations(arr)
    })
    return () => unsub()
  }, [db, user])

  return (
    <div>
      <div className="mb-6 bg-green-50 p-4 rounded border-l-4 border-green-500">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👤</span>
          <div>
            <h2 className="text-lg font-semibold text-green-900">User Dashboard</h2>
            <p className="text-sm text-green-700">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">My Permissions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✓ View available parking slots</li>
          <li>✓ Make reservations</li>
          <li>✓ View my bookings</li>
          <li>✓ Generate QR codes for my reservations</li>
        </ul>
      </div>

      {myReservations.length > 0 && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h3 className="font-semibold mb-4 text-lg">My Reservations</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {myReservations.map((res) => (
              <div
                key={res.id}
                className={`p-3 rounded border ${
                  res.status === 'reserved' ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'
                }`}
              >
                <div>
                  <p className="font-semibold">{res.vehicle}</p>
                  <p className="text-sm text-gray-600">{res.slotLabel}</p>
                  <p className="text-xs text-gray-500">Status: {res.status}</p>
                  {res.fee && <p className="text-xs font-semibold text-gray-700">Fee: ₱{res.fee}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold mb-4 text-lg">Available Parking Slots</h3>
        <ParkingSlots db={db} user={user} />
      </div>
    </div>
  )
}
