import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode.react'
import { collection, addDoc, serverTimestamp, onSnapshot, doc, updateDoc } from 'firebase/firestore'

const initialSlots = []

export default function ParkingSlots({ db, user }) {
  const [slots, setSlots] = useState(initialSlots)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    if (!db) return
    const slotsCol = collection(db, 'slots')
    const unsub = onSnapshot(slotsCol, (snap) => {
      const arr = snap.docs.map((d) => ({ _docId: d.id, ...d.data() }))
      setSlots(arr)
    })
    return () => unsub()
  }, [db])

  const reserve = async (slot) => {
    const vehicle = prompt('Enter vehicle plate number')
    if (!vehicle) return
    try {
      const docRef = await addDoc(collection(db, 'reservations'), {
        slotId: slot.id,
        slotLabel: slot.label,
        vehicle,
        user: user?.email || null,
        status: 'reserved',
        createdAt: serverTimestamp(),
      })
      // mark slot occupied and attach reservationId
      const slotDocId = slot._docId || String(slot.id)
      await updateDoc(doc(db, 'slots', String(slotDocId)), {
        occupied: true,
        vehicle,
        reservationId: docRef.id,
      })
      setSelected({ slot: { ...slot, occupied: true, vehicle, reservationId: docRef.id }, vehicle, reservationId: docRef.id })
    } catch (err) {
      alert('Reservation failed: ' + err.message)
    }
  }

  const checkout = async (slot) => {
    const fee = 20
    try {
      const slotDocId = slot._docId || String(slot.id)
      // update reservation doc if present
      if (slot.reservationId) {
        await updateDoc(doc(db, 'reservations', slot.reservationId), {
          status: 'checked_out',
          checkedOutAt: serverTimestamp(),
          fee,
        })
      }
      // clear slot
      await updateDoc(doc(db, 'slots', String(slotDocId)), {
        occupied: false,
        vehicle: null,
        reservationId: null,
      })
      setSelected(null)
    } catch (err) {
      alert('Checkout failed: ' + err.message)
    }
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {slots.map((slot) => (
          <div key={slot._docId || slot.id} className={`p-4 rounded shadow bg-white ${slot.occupied ? 'border-l-4 border-red-500' : 'border-l-4 border-green-500'}`}>
            <div className="flex justify-between items-center">
              <div>
                <div className="font-semibold">{slot.label}</div>
                <div className="text-sm text-gray-500">{slot.occupied ? `Occupied by ${slot.vehicle}` : 'Available'}</div>
              </div>
              <div className="space-y-2 text-right">
                {!slot.occupied ? (
                  <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={()=>reserve(slot)}>Reserve</button>
                ) : (
                  <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={()=>checkout(slot)}>Checkout</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h3 className="font-semibold">Reservation QR</h3>
          <div className="mt-3">
            <QRCode value={`slot:${selected.slot.id};vehicle:${selected.vehicle}`} size={128} />
          </div>
        </div>
      )}
    </div>
  )
}
