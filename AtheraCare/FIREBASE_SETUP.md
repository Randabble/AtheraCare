# Firebase Setup Guide for AtheraCare

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "AtheraCare"
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Click "Save"

## Step 3: Enable Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users
5. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon next to "Project Overview")
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Name it "AtheraCare Web"
5. Click "Register app"
6. Copy the configuration object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

## Step 5: Update Firebase Configuration

1. Open `src/firebase.ts` in your project
2. Replace the placeholder values with your actual Firebase config
3. Save the file

## Step 6: Test the App

1. Run `npm start` in your terminal
2. Scan the QR code with Expo Go
3. Try creating an account and signing in
4. Test the medication and hydration tracking

## Current Features

✅ **Authentication**: Sign up, sign in, sign out
✅ **User State Management**: Automatic login persistence
✅ **Medication Tracker**: Add/remove medications
✅ **Hydration Tracker**: Track water intake with progress
✅ **Clean UI**: Simple, intuitive interface

## Next Steps

Once Firebase is working, we can add:
- Data persistence (save medications and water intake to Firestore)
- User profiles
- Bottom navigation tabs
- Settings page
- Family features

## Troubleshooting

- **Authentication errors**: Make sure Email/Password is enabled in Firebase
- **Database errors**: Make sure Firestore is created and in test mode
- **Configuration errors**: Double-check your Firebase config values
