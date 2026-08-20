# Firebase Rules Deployment Guide

This guide explains how to deploy your Firestore and Storage rules to Firebase.

## 📋 Files Included

1. **firestore.rules** - Security rules for Firestore database
2. **storage.rules** - Security rules for Cloud Storage
3. **.firebaserc** - Firebase project configuration

## 🚀 How to Deploy Rules

### Prerequisites

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

### Deploy Firestore Rules Only

```bash
firebase deploy --only firestore:rules
```

### Deploy Storage Rules Only

```bash
firebase deploy --only storage:rules
```

### Deploy Both Firestore and Storage Rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

### Deploy Everything (Hosting + Rules)

```bash
firebase deploy
```

---

## 🔐 Security Rules Explained

### **Firestore Rules** (`firestore.rules`)

#### Users Collection
- ✅ Users can create their own profile
- ✅ Users can read/update their own data
- ✅ Admins can read/update all user data
- ❌ Users cannot delete profiles (Admins only)

#### Reservations Collection
- ✅ Users can create reservations (with their email)
- ✅ Users can read/update their own reservations
- ✅ Guards can read/update all reservations
- ✅ Admins can do everything
- ❌ Only admins can delete

#### Slots Collection
- ✅ Authenticated users can read slots
- ✅ Only admins can create/update/delete slots
- ❌ Users/Guards cannot modify slots

#### Analytics Collection
- ✅ Everyone can read analytics
- ✅ Only admins can write analytics
- ❌ Users/Guards are read-only

### **Storage Rules** (`storage.rules`)

- ✅ Users can read/write their own files (`/users/{userId}/*`)
- ✅ Admins can read/write any file
- ❌ Users cannot access other users' files
- ❌ Guests cannot access any files

---

## 📝 Role-Based Permissions Summary

### 👤 User Role
| Action | Users | Reservations | Slots | Analytics |
|--------|-------|--------------|-------|-----------|
| Read | Own | Own | ✓ | ✓ |
| Create | Own | Own | ✗ | ✗ |
| Update | Own | Own | ✗ | ✗ |
| Delete | ✗ | ✗ | ✗ | ✗ |

### 👮 Guard Role
| Action | Users | Reservations | Slots | Analytics |
|--------|-------|--------------|-------|-----------|
| Read | Own | All | ✓ | ✓ |
| Create | Own | Any | ✗ | ✗ |
| Update | Own | Any | ✗ | ✗ |
| Delete | ✗ | ✗ | ✗ | ✗ |

### ⚙️ Admin Role
| Action | Users | Reservations | Slots | Analytics |
|--------|-------|--------------|-------|-----------|
| Read | All | All | All | All |
| Create | All | All | All | All |
| Update | All | All | All | All |
| Delete | All | All | All | All |

---

## ✅ Testing Rules

### In Firebase Console

1. Go to **Firestore Database** → **Rules** tab
2. Click **Rules** and paste content from `firestore.rules`
3. Click **Publish**

Alternatively, use the Simulator:
1. Click **Simulate** button
2. Select Authentication state (User/Guard/Admin)
3. Test read/write operations

### Using Firebase Emulator Suite (Local Development)

```bash
# Install Firebase Emulator
npm install -g @firebase/cli

# Start emulator
firebase emulators:start

# Run in emulator mode
npm run dev
```

---

## 🛡️ Security Best Practices

1. ✅ **Always require authentication** - No anonymous access for sensitive data
2. ✅ **Use role-based access control** - Different permissions for different roles
3. ✅ **Validate data on write** - Check data structure before allowing writes
4. ✅ **Deny by default** - Whitelist what's allowed, not what's denied
5. ✅ **Never expose sensitive data** - Admins can see everything, but users can only see their own
6. ✅ **Use Custom Claims** - Store role in auth token for faster validation

---

## 🔄 Custom Claims Setup (For Role-Based Rules)

The rules rely on `request.auth.token.role` which comes from Firebase Custom Claims.

### Set Custom Claims (Using Firebase Admin SDK)

In your backend (e.g., Cloud Functions):

```javascript
const admin = require('firebase-admin');

// Set user role
admin.auth().setCustomUserClaims(uid, { role: 'guard' });

// Verify it worked
const customClaims = (await admin.auth().getUser(uid)).customClaims;
console.log(customClaims); // { role: 'guard' }
```

### Automatic Role Assignment (Recommended)

Your app (`src/components/RoleSelector.jsx`) stores the role in Firestore:

```javascript
await setDoc(doc(db, 'users', user.uid), {
  email: user.email,
  role: 'guard', // or 'admin' or 'user'
  createdAt: new Date(),
})
```

**Note:** The Custom Claims are separate from Firestore data. For production, you should:
1. Store role in Firestore (for app display)
2. Set Custom Claims in Firebase Auth (for rule validation)

---

## 🚨 Troubleshooting

### Rules not updating?
- Run: `firebase deploy --only firestore:rules --force`
- Check `.firebaserc` has correct project ID

### "Permission denied" error?
- Verify user is authenticated
- Check `request.auth.token.role` matches your role system
- Test in Firebase Console Simulator

### Custom Claims not working?
- Ensure you're using Firebase Admin SDK to set claims
- Claims may take 1 hour to propagate (or refresh ID token)
- Call `user.getIdTokenResult(true)` to force refresh

---

## 📚 Resources

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/rules)
- [Firestore Security Rules Guide](https://firebase.google.com/docs/firestore/security/get-started)
- [Cloud Storage Security Rules](https://firebase.google.com/docs/storage/security)
- [Using Custom Claims](https://firebase.google.com/docs/auth/admin-sdk-setup)

---

## ✨ Next Steps

1. Update `.firebaserc` with your actual project ID (already done: `parking-app-3556f`)
2. Review the rules in `firestore.rules` and `storage.rules`
3. Deploy: `firebase deploy --only firestore:rules,storage:rules`
4. Test in Firebase Console
5. Monitor usage in Firebase Analytics

**Your parking app is now secure!** 🎉
