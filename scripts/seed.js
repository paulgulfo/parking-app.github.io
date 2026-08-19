const admin = require('firebase-admin')
const fs = require('fs')
const path = require('path')

const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json')
if (!fs.existsSync(serviceAccountPath)) {
  console.error('serviceAccountKey.json not found. Place your Firebase service account JSON at:', serviceAccountPath)
  process.exit(1)
}

const serviceAccount = require(serviceAccountPath)
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
const db = admin.firestore()

async function seed() {
  console.log('Seeding slots...')
  const slotsRef = db.collection('slots')
  for (let i = 1; i <= 8; i++) {
    await slotsRef.doc(String(i)).set({ id: i, label: `Slot ${i}`, occupied: false })
  }

  console.log('Seeding sample reservation...')
  const reservationsRef = db.collection('reservations')
  await reservationsRef.add({
    slotId: 1,
    slotLabel: 'Slot 1',
    vehicle: 'TEST-123',
    user: 'test@example.com',
    status: 'reserved',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  })

  console.log('Seed completed')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed', err)
  process.exit(1)
})
