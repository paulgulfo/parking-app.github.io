import React from 'react'
import ParkingSlots from './ParkingSlots'

export default function Dashboard({ user, db }) {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-medium">Welcome, {user.email}</h2>
      </div>

      <ParkingSlots db={db} user={user} />
    </div>
  )
}
