# Parking App - Setup Guide

## Firebase Configuration

This app uses Firebase for authentication and database. Follow these steps to configure it:

### 1. Get Your Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **`parking-app-3556f`**
3. Go to **⚙️ Settings** → **Project Settings**
4. Scroll to **Your apps** section
5. Find your Web app and click it
6. Copy your configuration object

### 2. Update .env File

In the project root, you'll see a `.env` file. Replace the placeholder values with your actual Firebase credentials:

```
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=parking-app-3556f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=parking-app-3556f
VITE_FIREBASE_STORAGE_BUCKET=parking-app-3556f.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

**⚠️ IMPORTANT:** 
- `.env` file is protected by `.gitignore` - it won't be pushed to GitHub
- This is the SAFE place to store your Firebase credentials
- Never commit the `.env` file with real credentials

### 3. Build & Deploy

```bash
npm run build
git add .
git commit -m "Update Firebase configuration"
git push origin main
```

---

## User Roles

The app supports **THREE** different user roles:

### 👤 **User Role**
- View parking slots and availability
- Make reservations
- Track their bookings
- View QR codes for their reservations
- **Cannot**: Manage slots or view other users' reservations

### 👮 **Guard Role**
- Everything a User can do
- Reserve parking slots for others
- Process checkouts
- View all parking slot details
- **Cannot**: Delete reservations or manage system

### ⚙️ **Admin Role**
- Everything a Guard can do
- Full slot management (create/edit/delete)
- View analytics and statistics
- Delete reservations
- Manage user roles
- Export reports
- **Can**: Do anything in the system

---

## Security Rules

Firestore rules are defined in `firestore.rules`:

- **Users collection**: Only users can read/write their own data, admins can read all
- **Reservations collection**: Users can only see their own, guards can see all, admins can manage all
- **Slots collection**: Everyone can read, only admins can write

---

## Environment Variables

The app uses Vite's environment variable system. In your code, access them like:

```javascript
import.meta.env.VITE_FIREBASE_API_KEY
import.meta.env.VITE_FIREBASE_PROJECT_ID
// etc.
```

---

## Database Structure

### Users Collection
```javascript
{
  email: "user@example.com",
  role: "user" | "guard" | "admin",
  createdAt: timestamp
}
```

### Slots Collection
```javascript
{
  id: 1,
  label: "Slot 1",
  occupied: false,
  vehicle: null,
  reservationId: null
}
```

### Reservations Collection
```javascript
{
  slotId: 1,
  slotLabel: "Slot 1",
  vehicle: "ABC-1234",
  user: "user@example.com",
  status: "reserved" | "checked_out",
  fee: 20,
  createdAt: timestamp,
  checkedOutAt: timestamp
}
```

---

## Troubleshooting

### Issue: "Unable to fetch credentials"
**Solution**: Make sure `.env` file is in project root with correct values

### Issue: "Firestore not available"
**Solution**: Check Firebase project is set to `parking-app-3556f`

### Issue: "Authentication error"
**Solution**: Verify your `apiKey` and `authDomain` in `.env`

---

## Need Help?

Check Firebase Documentation:
- [Firebase Auth](https://firebase.google.com/docs/auth)
- [Firestore](https://firebase.google.com/docs/firestore)
- [Environment Variables in Vite](https://vitejs.dev/guide/env-and-mode.html)
