# Firebase Authentication Troubleshooting

If you're getting "invalid-credential" errors, please check the following:

## 1. Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `athera-care`
3. Go to **Authentication** in the left sidebar
4. Click on **Sign-in method** tab
5. Make sure **Email/Password** is enabled and set to **Enabled**

## 2. Common Issues

### Issue: "auth/invalid-credential"
This usually means:
- The user doesn't exist in the database
- The password is incorrect
- Email/Password authentication is not enabled

### Solution:
1. **First, try to create a new account** using the Sign Up option
2. **Check if Email/Password is enabled** in Firebase Console
3. **Verify your Firebase project ID** matches the one in your code

## 3. Testing Steps

1. **Use the "Test Firebase Connection" button** in the login screen
2. **Check the console logs** for detailed error information
3. **Try creating a new account first** before signing in

## 4. Firebase Project Verification

Your current Firebase config:
- Project ID: `athera-care`
- Auth Domain: `athera-care.firebaseapp.com`
- API Key: `AIzaSyCn_hwWOvhPkUzrsVvyOwaKdyKL06ZFjSI`

## 5. If Still Having Issues

1. **Clear app data** and try again
2. **Check internet connection**
3. **Verify Firebase project is in the correct region**
4. **Make sure you're using the latest version of the app**

## 6. Debug Information

The app now includes:
- Better error messages
- Firebase connection testing
- Detailed console logging
- Input validation

Check the console logs for detailed information about what's happening during authentication.
