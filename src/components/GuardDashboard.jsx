import React from 'react'
import ParkingSlots from './ParkingSlots'

export default function GuardDashboard({ user, db }) {
  return (
    <div>
      <div className="mb-6 bg-blue-50 p-4 rounded border-l-4 border-blue-500">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👮</span>
          <div>
            <h2 className="text-lg font-semibold text-blue-900">Guard Dashboard</h2>
            <p className="text-sm text-blue-700">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="font-semibold mb-2">Guard Permissions:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>✓ View parking slot status</li>
          <li>✓ Reserve parking slots</li>
          <li>✓ Checkout reservations</li>
          <li>✓ View QR codes</li>
        </ul>
      </div>

      <ParkingSlots db={db} user={user} />
    </div>
  )
}
